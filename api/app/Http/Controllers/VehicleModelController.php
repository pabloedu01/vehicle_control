<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrand;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VehicleModelController extends Controller
{
    public function index(Request $request)
    {
        $vehicleModels = VehicleModel::where('brand_id', '=', $request->brand_id)
                                     ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicleModels,
                                ],
                                Response::HTTP_OK
        );
    }

    public function activeVehicleModels(Request $request)
    {
        $vehicleModels = VehicleModel::where('brand_id', '=', $request->brand_id)
                                     ->where('active', '=', true)
                                     ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicleModels,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $vehicleModel = VehicleModel::where('id', '=', $id)
                                    ->first();

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       'msg'  => trans('general.msg.success'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       'data' => $vehicleModel,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), VehicleModel::rules(null, $request->brand_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $brand        = VehicleBrand::find($request->brand_id);
        $vehicleModel = new VehicleModel($request->merge([ 'company_id' => $brand->company_id ])->only(VehicleModel::getFillables()));

        if(secureSave($vehicleModel))
        {
            return response()->json(   [
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $vehicleModel,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $vehicleModel = VehicleModel::where('id', '=', $id)->first();

        $validator = validate($request->all(), VehicleModel::rules($vehicleModel->id, $vehicleModel->brand_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicleModel->fill(collect($request->except([ 'company_id' ]))->only(VehicleModel::getFillables())->toArray());

        if(!$vehicleModel->hasAppliedChanges() || secureSave($vehicleModel))
        {
            return response()->json(   [
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $vehicleModel,
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $vehicleModel = VehicleModel::where('id', '=', $id)->first();

        if(secureDelete($vehicleModel))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
