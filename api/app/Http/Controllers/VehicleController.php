<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = Vehicle::with('model', 'model.brand')
                           ->where('model_id', '=', $request->model_id)
                           ->get();

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $vehicles, ], Response::HTTP_OK);
    }

    public function activeVehicles(Request $request)
    {
        $vehicles = Vehicle::with('model', 'model.brand')
                           ->where('model_id', '=', $request->model_id)
                           ->where('active', '=', true)
                           ->get();

        return response()->json([ 'msg' => trans('general.msg.success'), 'data' => $vehicles, ], Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $vehicle = Vehicle::with('model', 'model.brand', 'brand')
                          ->where('id', '=', $id)
                          ->first();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicle,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Vehicle::rules(null, $request->company_id, $request->model_id, $request->model_year));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $model   = VehicleModel::find($request->model_id);
        $vehicle = new Vehicle($request->merge([ 'company_id' => $model->company_id, 'brand_id' => $model->brand_id ])->only(Vehicle::getFillables()));

        if(secureSave($vehicle))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $vehicle,
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
        $vehicle = Vehicle::where('id', '=', $id)->first();
        $model   = VehicleModel::find($request->model_id);

        $validator = validate($request->all(), Vehicle::rules($vehicle->id, $vehicle->company_id, $request->model_id, $request->model_year));

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $vehicle->fill(collect($request->merge([ 'brand_id' => $model->brand_id ])->except([ 'company_id' ]))->only(Vehicle::getFillables())->toArray());

        if(!$vehicle->hasAppliedChanges() || secureSave($vehicle))
        {
            return response()->json([
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $vehicle,
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
        $vehicle = Vehicle::where('id', '=', $id)->first();

        if(secureDelete($vehicle))
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
