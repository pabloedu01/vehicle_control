<?php

namespace App\Http\Controllers;

use App\Models\ClientVehicle;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientVehicleController extends Controller
{
    public function index(Request $request)
    {
        $clientVehicles = ClientVehicle::with([ 'vehicle', 'vehicle.model', 'vehicle.model.brand' ])
                                       ->where('vehicle_id', '=', $request->vehicle_id)
                                       ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $clientVehicles,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $clientVehicle = ClientVehicle::with([ 'vehicle', 'vehicle.model', 'vehicle.model.brand' ])
                                      ->where('id', '=', $id)
                                      ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $clientVehicle,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $vehicle = Vehicle::where('id', '=', $request->vehicle_id)->first();

        $request->merge([
                            'company_id' => $vehicle->company_id,
                        ]);

        $validator = validate($request->all(), ClientVehicle::rules(null, $vehicle->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $clientVehicle = new ClientVehicle($request->only(ClientVehicle::getFillables()));

        if(secureSave($clientVehicle))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $clientVehicle,
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
        $clientVehicle = ClientVehicle::where('id', '=', $id)->first();

        $validator = validate($request->all(), ClientVehicle::rules($clientVehicle->id, $clientVehicle->company_id));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $clientVehicle->fill(collect($request->except([ 'company_id' ]))->only(ClientVehicle::getFillables())->toArray());

        if(!$clientVehicle->hasAppliedChanges() || secureSave($clientVehicle))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $clientVehicle,
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
        $clientVehicle = ClientVehicle::where('id', '=', $id)->first();

        if(secureDelete($clientVehicle))
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
