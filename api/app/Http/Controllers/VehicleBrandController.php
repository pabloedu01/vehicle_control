<?php

namespace App\Http\Controllers;

use App\Models\VehicleBrand;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\VehicleBrandChecklistVersion as Version;

class VehicleBrandController extends Controller
{
    public function checklist(Request $request, $id, $version_id = null)
    {
        $version = Version::with([ 'brand', 'items' ])
                          ->version($id,$version_id)
                          ->first();

        if($version)
        {
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                        'data' => $version,
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

    public function index(Request $request)
    {
        $vehicleBrands = VehicleBrand::where('company_id', '=', $request->company_id)
                                     ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicleBrands,
                                ],
                                Response::HTTP_OK
        );
    }

    public function activeBrands(Request $request)
    {
        $vehicleBrands = VehicleBrand::where('company_id', '=', $request->company_id)
                                     ->where('active', '=', true)
                                     ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $vehicleBrands,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $vehicleBrand = VehicleBrand::where('id', '=', $id)
                                    ->first();

        return response()->json(   [
                                    'msg' => trans('general.msg.success'),
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
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicleBrand = new VehicleBrand($request->only(VehicleBrand::getFillables()));

        if(secureSave($vehicleBrand))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $vehicleBrand,
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
        $vehicleBrand = VehicleBrand::where('id', '=', $id)->first();

        $validator = validate($request->all(), VehicleBrand::rules($vehicleBrand->id, $vehicleBrand->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicleBrand->fill(collect($request->except([ 'company_id' ]))->only(VehicleBrand::getFillables())->toArray());

        if(!$vehicleBrand->hasAppliedChanges() || secureSave($vehicleBrand))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $vehicleBrand,
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

    public function destroy(Request $request, $id)
    {
        $vehicleBrand = VehicleBrand::where('id', '=', $id)->first();

        if(secureDelete($vehicleBrand))
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
