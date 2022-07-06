<?php

namespace App\Http\Controllers;

use App\Models\TireBrand;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TireBrandController extends Controller
{
    public function index(Request $request)
    {
        $tireBrands = TireBrand::where('company_id', '=', $request->company_id)
                               ->get();

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'msg' => trans('general.msg.success'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'data' => $tireBrands,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ], Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $tireBrand = TireBrand::where('id', '=', $id)
                              ->first();

        return response()->json(   [
                                    'msg' => trans('general.msg.success'),
                                    'data' => $tireBrand,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), TireBrand::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $tireBrand = new TireBrand($request->only(TireBrand::getFillables()));

        if(secureSave($tireBrand))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $tireBrand,
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
        $tireBrand = TireBrand::where('id', '=', $id)->first();

        $validator = validate($request->all(), TireBrand::rules($tireBrand->id, $tireBrand->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $tireBrand->fill(collect($request->except([ 'company_id' ]))->only(TireBrand::getFillables())->toArray());

        if(!$tireBrand->hasAppliedChanges() || secureSave($tireBrand))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $tireBrand,
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
        $tireBrand = TireBrand::where('id', '=', $id)->first();

        if(!$tireBrand->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($tireBrand->secureDelete())
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
