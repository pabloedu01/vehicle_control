<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailJob;
use App\Mail\ChecklistReportEmail;
use App\Models\ChecklistItem;
use App\Models\ChecklistReport;
use App\Models\ChecklistVersion as Version;
use App\Models\ChecklistVersionStage;
use App\Models\VehicleService;
use App\Rules\ChecklistResults;
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

    public function stages(Request $request, $id)
    {
        $version = Version::withoutGlobalScope('simpleColumns')
                          ->where('id', '=', $id)
                          ->first();

        $versionStages = ChecklistVersionStage::with(['items'])
                                              ->where('checklist_version_id', '=', $version->id)
                                              ->get();


        $stages = $versionStages->map(function($stage){
           return [
             'id' => $stage->id,
             'name' => $stage->name,
             'list' => $stage->items->map(function($item){
                return [
                  'id' => $item->id,
                  'name' => $item->name,
                  'validation' => $item->validation,
                ];
             })
           ];
        });

        $available = ChecklistItem::where('active', '=', true)
            ->whereNotIn('id', $versionStages->count() > 0 ? array_merge(...$versionStages->map(function($stage){return $stage->items->pluck('id')->toArray();})->toArray()) : [])
                                       ->get();

        $version->available = $available;
        $version->stages = $stages;

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $version,
                                ],
                                Response::HTTP_OK
        );
    }

    public function validations(Request $request, $id){
        $validator = validate($request->all(), ['checklist' => [
            'required', 'array', new ChecklistResults($id)
        ]]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                ],
                                Response::HTTP_OK
        );
    }

    public function details(Request $request, $id)
    {
        $version = Version::with([ 'stages', 'stages.items' ])
                          ->withoutGlobalScope('simpleColumns')
                          ->withTrashed()
                          ->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $version,
                                ],
                                Response::HTTP_OK
        );
    }

    public function generateReport(Request $request, $id)
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
                                                           'serviceSchedule.clientVehicle',
                                                           'serviceSchedule.clientVehicle.vehicle',
                                                           'serviceSchedule.clientVehicle.vehicle.model',
                                                           'client',
                                                           'items' => function($query){
                                                               return $query->withTrashed();
                                                           },
                                                       ])->where('service_schedule_id', '=', $request->id)->first();

                $customData = [
                    'client_name'   => @$vehicleService->client->name ?? '',
                    'brand_name'    => @$vehicleService->brand->name ?? '',
                    'model_name'    => @$vehicleService->serviceSchedule->clientVehicle->vehicle->model->name ?? '',
                    'vehicle_name'  => @$vehicleService->serviceSchedule->clientVehicle->vehicle->name ?? '',
                    'plate'         => @$vehicleService->serviceSchedule->clientVehicle->plate ?? '',
                    'chasis'        => @$vehicleService->serviceSchedule->clientVehicle->chasis ?? '',
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
                                                                      if($parameter['type'] == 'map'){
                                                                          return [
                                                                              'Value' => $parameter['children'][0]['testData'],
                                                                              'Observation' => $parameter['children'][1]['testData'],
                                                                          ];
                                                                      } else {
                                                                          return $parameter['testData'];
                                                                      }
                                                                  })
                                                                  ->toArray();

        $dataFromVehicleService   = array_merge(...$vehicleService->items->map(function($item){
            return [
                $item->formatted_name => [
                    'Value' => $item->pivot->value,
                    'Observation' => $item->pivot->observations
                ]
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
                $dataFromCustomParameters[$parameterName] = date('Y-m-d H:i:s', strtotime($value.' '.$request->utcOffset.' minutes'));
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
                $fullName     = 'checklist-reports/'.$reportKey.'.pdf';

                $storage = \Storage::disk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public'));
                $storage->put($fullName, file_get_contents($reportBroUrl));

                $checklistReport = ChecklistReport::create([
                                            'vehicle_service_id' => $vehicleService->id,
                                            'filename'           => $fullName,
                                        ]);

                return response()->json([
                                            'msg'  => trans('general.msg.success'),
                                            'data' => $checklistReport,
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

    public function print(Request $request)
    {
        $report = ChecklistReport::withTrashed()
                                 ->where('id', '=', $request->id)
                                 ->first();

        $storage = \Storage::disk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public'));

        if($report && $storage->exists($report->filename))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => [
                                            'report' => $storage->url($report->filename),
                                        ],
                                    ],
                                    Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }
    }

    public function send(Request $request, $id)
    {
        $report = ChecklistReport::with([ 'vehicleService', 'vehicleService.client' ])
                                 ->where('id', '=', $request->id)
                                 ->first();

        $storage = \Storage::disk(env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public'));

        if($report && $storage->exists($report->filename))
        {
            dispatch(new SendEmailJob([
                                          'to'     => $report->vehicleService->client->email,
                                          'report' => $report->filename,
                                          'user'   => $report->vehicleService->client,
                                      ],
                                      ChecklistReportEmail::class));

            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                    ],
                                    Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }
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
            foreach($request->stages as $stage){
                $version->stages()->create([
                                               'name' => $stage['name']
                                           ])
                        ->items()
                        ->sync(array_column(@$stage['list'] ?? [],'id'));
            }

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
            ChecklistVersionStage::where('checklist_version_id', '=', $version->id)->delete();

            foreach($request->stages as $stage)
            {
                $version->stages()->create([
                                               'name' => $stage['name'],
                                           ])
                        ->items()
                        ->sync(array_column(@$stage['list'] ?? [], 'id'));
            }

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

        if(!$version->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($version->secureDelete())
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

    public function destroyReport(Request $request, $id, $reportId)
    {
        $report = ChecklistReport::where('id', '=', $reportId)->first();

        if(!$report->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($report->secureDelete())
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
