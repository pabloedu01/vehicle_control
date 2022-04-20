<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrand;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VehicleBrandController extends Controller
{
    public function index(Request $request)
    {
        $vehicleBrands = VehicleBrand::where('company_id', '=', $request->company_id)
                                     ->whereNull('deleted_at')
                                     ->get();

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'msg'  => '¡Success!',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'data' => $vehicleBrands,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ], Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $vehicleBrand = VehicleBrand::where('id', '=', $id)
                                    ->first();

        return response()->json(   [
                                    'msg'  => '¡Success!',
                                    'data' => $vehicleBrand,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), VehicleBrand::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicleBrand = new VehicleBrand($request->only(VehicleBrand::getFillables()));

        if(secureSave($vehicleBrand))
        {
            return response()->json(   [
                                        'msg'  => '¡Success!',
                                        'data' => $vehicleBrand,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function update(Request $request, $id)
    {
        $vehicleBrand = VehicleBrand::where('id', '=', $id)->first();

        $validator = validate($request->all(), VehicleBrand::rules($vehicleBrand->id, $vehicleBrand->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicleBrand->fill(collect($request->except([ 'company_id' ]))->only(VehicleBrand::getFillables())->toArray());

        if(!$vehicleBrand->hasAppliedChanges() || secureSave($vehicleBrand))
        {
            return response()->json(   [
                                        'msg'  => '¡Success!',
                                        'data' => $vehicleBrand,
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $vehicleBrand = VehicleBrand::where('id', '=', $id)->first();

        if(secureDelete($vehicleBrand))
        {
            return response()->json(   [
                                        'msg' => '¡Success!',
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
