<?php

namespace App\Http\Controllers;

use App\Models\ChecklistReport;
use App\Models\Vehicle;
use App\Models\VehicleService;
use App\Http\Requests\VehicleService as VehicleServiceRequest;
use App\Models\VehicleServiceClientData as ClientData;
use App\Models\VehicleServiceTechnicalConsultantData as TechnicalConsultantData;
use App\Models\VehicleServiceVehicleData as VehicleData;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VehicleServiceController extends Controller
{
    private static $with = [ 'brand', 'checklistVersion', 'client', 'technicalConsultant', 'technicalConsultant.user', 'serviceSchedule', 'serviceSchedule.clientVehicle', 'vehicle' ];

    public function index(Request $request)
    {
        $vehicleServices = VehicleService::with(self::$with)
                                         ->where('company_id', '=', $request->company_id)
                                         ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicleServices,
                                ],
                                Response::HTTP_OK
        );
    }

    public function reports(Request $request, $id)
    {
        $reports = ChecklistReport::where('vehicle_service_id', '=', $id)
                                         ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $reports,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $vehicleService = VehicleService::with(array_merge(self::$with, ['stages.items','items' => function($query){return $query->withTrashed();}]))
                                         ->where('vehicle_services.id', '=', $id)
                                         ->first();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $vehicleService,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(VehicleServiceRequest $request)
    {
        if($request->has('vehicle_id')){
            $vehicle = Vehicle::find($request->vehicle_id);

            $brand_id = $vehicle->brand_id;
        } else {
            $brand_id = $request->brand_id;
        }

        $vehicleService = new VehicleService(array_merge($request->only(VehicleService::getFillables()), ['completed' => false]));

        if(secureSave($vehicleService))
        {
            $vehicleService->clientData()
                           ->create(ClientData::changeDataColumns($request->only(ClientData::changeFillablesColumns())));

            $vehicleService->technicalConsultantData()
                           ->create(TechnicalConsultantData::changeDataColumns($request->only(TechnicalConsultantData::changeFillablesColumns())));

            $vehicleService->vehicleData()->create($request->merge(['brand_id' => $brand_id])->only(VehicleData::getFillables()));

            $vehicleService->items()->sync(collect($request->checklist)->keyBy('id')->map(function($item){
                return [ 'value' => @$item['value'], 'evidence' => @$item['evidence'], 'observations' => @$item['observations'] ];
            })->toArray());

            $defaultStages = $vehicleService->checklistVersion->stages->keyBy('id')->map(function(){
                return [
                    'client_signature' => null,
                    'technical_consultant_signature' => null,
                    'client_signature_date' => null,
                    'technical_consultant_signature_date' => null,
                    'completed' => false,
                    'processed' => false
                ];
            })->toArray();

            $defaultStages[$request->stage_id] = array_merge($request->only([
                                                                                'client_signature',
                                                                                'technical_consultant_signature',
                                                                                'client_signature_date',
                                                                                'technical_consultant_signature_date',
                                                                                'completed'
                                                                            ]), ['processed' => true]);

            $vehicleService->stages()->sync($defaultStages);

            $vehicleService->setCompleted(true);

            #se vuelve a solicitar el vehicle, para que venga con el global scope integrado
            $vehicleService = VehicleService::with(array_merge(self::$with, ['stages', 'stages.items','items']))->find($vehicleService->id);

            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                        'data' => $vehicleService,
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

    public function update(VehicleServiceRequest $request, $id)
    {
        if($request->has('vehicle_id')){
            $vehicle = Vehicle::find($request->vehicle_id);

            $brand_id = $vehicle->brand_id;
        } else {
            $brand_id = $request->brand_id;
        }

        $vehicleService = VehicleService::withoutGlobalScope('joinToData')
                                        ->where('id', '=', $id)
                                        ->first();

        $vehicleService->fill(array_merge($request->only(VehicleService::getFillables()), ['completed' => false]));

        if(!$vehicleService->hasAppliedChanges() || secureSave($vehicleService))
        {
            $vehicleService->clientData->update(ClientData::changeDataColumns($request->only(ClientData::changeFillablesColumns())));
            $vehicleService->technicalConsultantData->update(TechnicalConsultantData::changeDataColumns($request->only(TechnicalConsultantData::changeFillablesColumns())));
            $vehicleService->vehicleData->update($request->merge(['brand_id' => $brand_id])->only(VehicleData::getFillables()));

            $oldItems = $vehicleService->items->keyBy('id')->map(function($item){
                return [ 'value' => $item->pivot->value, 'evidence' => $item->pivot->evidence, 'observations' => $item->pivot->observations ];
            })->toArray();

            $newItems = collect($request->checklist)->keyBy('id')->map(function($item){
                return [ 'value' => @$item['value'], 'evidence' => @$item['evidence'], 'observations' => @$item['observations'] ];
            })->toArray();

            $vehicleService->items()->withTrashed()->sync($newItems + $oldItems);

            $oldStages = $vehicleService->stages->keyBy('id')->map(function($item){
                return $item->pivot->only([
                                              'client_signature',
                                              'technical_consultant_signature',
                                              'client_signature_date',
                                              'technical_consultant_signature_date',
                                              'completed',
                                              'processed'
                                          ]);
            })->toArray();

            $oldStages[$request->stage_id] = array_merge($request->only([
                                                                            'client_signature',
                                                                            'technical_consultant_signature',
                                                                            'client_signature_date',
                                                                            'technical_consultant_signature_date',
                                                                            'completed'
                                                                        ]), ['processed' => true]);

            $vehicleService->stages()->sync($oldStages);

            $vehicleService->setCompleted();

            #se vuelve a solicitar el vehicle, para que venga con el global scope integrado
            $vehicleService = VehicleService::with(array_merge(self::$with, ['stages', 'stages.items','items']))->find($vehicleService->id);

            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                        'data' => $vehicleService,
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
        $vehicleService = VehicleService::withoutGlobalScope('joinToData')->where('id', '=', $id)->first();

        if($vehicleService->secureDelete())
        {
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                    ],
                                    Response::HTTP_OK
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
}
