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

        return response()->json([ 'msg' => '¡Success!', 'data' => $vehicles, ], Response::HTTP_OK);
    }

    public function show(Request $request, $id)
    {
        $vehicle = Vehicle::with('model', 'model.brand')
                          ->where('id', '=', $id)
                          ->first();

        return response()->json(   [
                                    'msg'  => '¡Success!',
                                    'data' => $vehicle,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Vehicle::rules(null, $request->model_id, $request->model_year));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }


        $model   = VehicleModel::find($request->model_id);
        $vehicle = new Vehicle($request->merge([ 'company_id' => $model->company_id ])->only(Vehicle::getFillables()));

        if(secureSave($vehicle))
        {
            return response()->json(                                 [
                                                                      'msg'  => '¡Success!',
                                                                      'data' => $vehicle,
                                                                  ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::where('id', '=', $id)->first();

        $validator = validate($request->all(), Vehicle::rules($vehicle->id, $vehicle->model_id, $request->model_year));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicle->fill(collect($request->except([ 'company_id' ]))->only(Vehicle::getFillables())->toArray());

        if(!$vehicle->hasAppliedChanges() || secureSave($vehicle))
        {
            return response()->json(   [
                                        'msg'  => '¡Success!',
                                        'data' => $vehicle,
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $vehicle = Vehicle::where('id', '=', $id)->first();

        if(secureDelete($vehicle))
        {
            return response()->json([
                                        'msg' => '¡Success!',
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
