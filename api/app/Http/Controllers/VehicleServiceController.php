<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrandChecklistVersion as ChecklistVersion;
use App\Models\VehicleService;
use App\Http\Requests\VehicleService as VehicleServiceRequest;
use App\Models\VehicleServiceClientData as ClientData;
use App\Models\VehicleServiceTechnicalConsultantData as TechnicalConsultantData;
use App\Models\VehicleServiceVehicleData as VehicleData;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VehicleServiceController extends Controller
{
    private static $with = [ 'brand', 'version', 'client', 'technicalConsultant', 'technicalConsultant.user', 'serviceSchedule' ];

    public function index(Request $request)
    {
        $vehicleServices = VehicleService::with(self::$with)
                                         ->where('company_id', '=', $request->company_id)
                                         ->get();

        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $vehicleServices,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $vehicleServices = VehicleService::with(array_merge(self::$with, ['items']))
                                         ->where('vehicle_services.id', '=', $id)
                                         ->first();

        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $vehicleServices,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(VehicleServiceRequest $request)
    {
        $checklistVersion = ChecklistVersion::version($request->brand_id, $request->version_id)->first();

        $vehicleService = new VehicleService($request->merge([ 'version_id' => $checklistVersion->id ])->only(VehicleService::getFillables()));

        if(secureSave($vehicleService))
        {
            $vehicleService->clientData()
                           ->create(ClientData::changeDataColumns($request->only(ClientData::changeFillablesColumns())));

            $vehicleService->technicalConsultantData()
                           ->create(TechnicalConsultantData::changeDataColumns($request->only(TechnicalConsultantData::changeFillablesColumns())));

            $vehicleService->vehicleData()->create($request->only(VehicleData::getFillables()));

            $vehicleService->items()->sync(collect($request->checklist)->keyBy('id')->map(function($item){
                return [ 'value' => @$item['value'], 'evidence' => @$item['evidence'] ];
            })->toArray());

            #se vuelve a solicitar el vehicle, para que venga con el global scope integrado
            $vehicleService = VehicleService::with(array_merge(self::$with, ['items']))->find($vehicleService->id);

            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $vehicleService,
                                    ],
                                    Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(VehicleServiceRequest $request, $id)
    {
        $vehicleService = VehicleService::withoutGlobalScope('joinToData')
                                        ->where('id', '=', $id)
                                        ->first();

        $vehicleService->fill($request->only(VehicleService::getFillables()));

        if(!$vehicleService->hasAppliedChanges() || secureSave($vehicleService))
        {
            $vehicleService->clientData->update(ClientData::changeDataColumns($request->only(ClientData::changeFillablesColumns())));
            $vehicleService->technicalConsultantData->update(TechnicalConsultantData::changeDataColumns($request->only(TechnicalConsultantData::changeFillablesColumns())));
            $vehicleService->vehicleData->update($request->only(VehicleData::getFillables()));

            $vehicleService->items()->sync(collect($request->checklist)->keyBy('id')->map(function($item){
                return [ 'value' => @$item['value'], 'evidence' => @$item['evidence'] ];
            })->toArray());

            #se vuelve a solicitar el vehicle, para que venga con el global scope integrado
            $vehicleService = VehicleService::with(array_merge(self::$with, ['items']))->find($vehicleService->id);

            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $vehicleService,
                                    ],
                                    Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $vehicleService = VehicleService::withoutGlobalScope('joinToData')->where('id', '=', $id)->first();

        if(secureDelete($vehicleService))
        {
            return response()->json([
                                        'msg' => '¡Success!',
                                    ],
                                    Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ],
                                    Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
