<?php

namespace App\Http\Controllers;

use App\Models\ChecklistVersion as Version;
use App\Models\VehicleService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChecklistVersionController extends Controller
{
    public function index(Request $request)
    {
        $versions = Version::get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $versions,
                                ],
                                Response::HTTP_OK
        );
    }

    public function activeVersions(Request $request)
    {
        $versions = Version::where('active', '=', true)
                           ->whereNotNull('report')
                           ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $versions,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $version = Version::withoutGlobalScope('simpleColumns')
                          ->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $version,
                                ],
                                Response::HTTP_OK
        );
    }

    public function items(Request $request, $id)
    {
        $version = Version::withoutGlobalScope('simpleColumns')
                          ->withTrashed()
                          ->where('id', '=', $id)
                          ->first();

        $version->append('formatted_report');
        $version->append('items');

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $version,
                                ],
                                Response::HTTP_OK
        );
    }

    public function print(Request $request, $id)
    {
        $version = Version::withTrashed()->withoutGlobalScope('simpleColumns')
                          ->where('id', '=', $id)
                          ->first();

        if(is_null($version->report))
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version->append('formatted_report');
        $version->append('items');

        $report                        = $version->formatted_report;
        $reportParameters              = collect($report['parameters']);
        $reportParametersGroupedByName = $reportParameters->keyBy('name');
        $customParameters              = array_values(VehicleService::$changingColumnsForReport);

        $vehicleService = null;
        $customData = [];

        switch($request->type)
        {
            case 'service-schedules':
                $vehicleService = VehicleService::with([
                                                           'serviceSchedule',
                                                           'brand',
                                                           'vehicle',
                                                           'vehicle.model',
                                                           'client',
                                                           'items' => function($query){
                                                               return $query->withTrashed();
                                                           },
                                                       ])->where('service_schedule_id', '=', $request->id)->first();

                $customData = [
                    'client_name'   => @$vehicleService->client->name ?? '',
                    'brand_name'    => @$vehicleService->brand->name ?? '',
                    'model_name'    => @$vehicleService->vehicle->model->name ?? '',
                    'vehicle_name'  => @$vehicleService->vehicle->name ?? '',
                    'plate'         => @$vehicleService->serviceSchedule->plate ?? '',
                    'chasis'        => @$vehicleService->serviceSchedule->chasis ?? '',
                    'schedule_date' => @$vehicleService->serviceSchedule->promised_date ?? '',
                ];

                break;
        }

        if(!$vehicleService)
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }

        foreach($customData as $column => $value){
            $vehicleService->{$column} = $value;
        }

        $dataFromParameters       = $reportParametersGroupedByName->except(array_merge([ 'page_count', 'page_number' ], $customParameters))
                                                                  ->map(function($parameter){
                                                                      return $parameter['testData'];
                                                                  })
                                                                  ->toArray();
        $dataFromVehicleService   = array_merge(...$vehicleService->items->map(function($item){
            return [
                $item->formatted_name => $item->pivot->value,
                $item->formatted_name.'Observacao' => $item->pivot->observations,
            ];
        })->toArray());

        $dataFromCustomParameters = VehicleService::changeDataColumns($vehicleService->only(
            array_map(function($parameterName){
                return array_flip(VehicleService::$changingColumnsForReport)[$parameterName];
            }, array_filter($customParameters, function($parameterName) use ($reportParametersGroupedByName){
                return isset($reportParametersGroupedByName[$parameterName]);
            }))
        ),                                                            VehicleService::$changingColumnsForReport);
        foreach($dataFromCustomParameters as $parameterName => $value)
        {
            if($reportParametersGroupedByName[$parameterName]['type'] == 'date')
            {
                $dataFromCustomParameters[$parameterName] = gmdate('Y-m-d H:i:s', strtotime($value.' '.$request->utcOffset.' minutes'));
            }
        }

        $data = array_merge($dataFromParameters, $dataFromVehicleService, $dataFromCustomParameters);

        $curlInstance = callAPI('https://www.reportbro.com/report/run', 'PUT', json_encode([
                                                                                               'report'       => $version->customReport($data),
                                                                                               'outputFormat' => 'pdf',
                                                                                               'data'         => $data,
                                                                                               'isTestData'   => true,
                                                                                           ]),
                                false, [ 'Content-Type: application/json' ], false, true);

        $response   = curl_exec($curlInstance);
        $httpStatus = curl_getinfo($curlInstance, CURLINFO_HTTP_CODE);

        if($httpStatus == 200)
        {
            if(is_string($response) && substr($response, 0, 4) === 'key:')
            {
                $reportKey    = substr($response, 4);
                $reportBroUrl = 'https://www.reportbro.com/report/run?key='.$reportKey.'&outputFormat=pdf';
                $fullName     = 'temporal-files/'.$reportKey.'.pdf';

                $localStorage = \Storage::disk('public');
                $localStorage->put($fullName, file_get_contents($reportBroUrl));
                /*debería guardar el archivo y anclarlo al vehicle service?*/

                return response()->json([
                                            'msg'  => trans('general.msg.success'),
                                            'data' => [
                                                'report' => $localStorage->url($fullName),
                                            ],
                                        ],
                                        Response::HTTP_OK
                );
            }
        }

        return response()->json([
                                    'msg' => trans('general.msg.error'),
                                ],
                                Response::HTTP_INTERNAL_SERVER_ERROR
        );
    }

    public function duplicate(Request $request, $id)
    {
        $version = Version::withoutGlobalScope('simpleColumns')
                          ->where('id', '=', $id)
                          ->first();

        $newVersion = new Version(collect($version->toArray())->except(['id'])->toArray());
        $newVersion->code = $newVersion->code.'-duplicated-'.strtolower(\Str::random(4));
        $newVersion->name = $newVersion->name.' ('.trans('general.duplicated').')';

        if(secureSave($newVersion)){
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $newVersion,
                                    ],
                                    Response::HTTP_CREATED
            );
        } else {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function storeReport(Request $request, $id)
    {
        $request->merge(['report' => json_decode($request->report,true)]);

        $validator = validate($request->all(), [ 'report' => 'required|array' ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version         = Version::where('id', '=', $id)->first();
        $version->report = $request->report;

        if(secureSave($version))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $version,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Version::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version = new Version($request->only(Version::getFillables()));

        if(secureSave($version))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $version,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $version = Version::where('id', '=', $id)->first();

        $validator = validate($request->all(), Version::rules($id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $version->fill($request->only(Version::getFillables()));

        if(!$version->hasAppliedChanges() || secureSave($version))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $version,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $version = Version::where('id', '=', $id)->first();

        if(secureDelete($version))
        {
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
