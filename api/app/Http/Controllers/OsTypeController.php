<?php

namespace App\Http\Controllers;

use App\Models\OsType;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class OsTypeController extends Controller
{public function index(Request $request)
    {
        $OsTypes = OsType::where('company_id', '=', $request->company_id)
                                     ->get();

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'msg' => trans('general.msg.success'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'data' => $OsTypes,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ], Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $OsType = OsType::where('id', $id)
                                    ->first();

        return response()->json(   [
                                    'msg' => trans('general.msg.success'),
                                    'data' => $OsType,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {

        $OsType = new OsType($request->all());

        if(secureSave($OsType))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $OsType,
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
        $OsType = OsType::where('id', '=', $id)->first();

        $validator = validate($request->all(), OsType::rules($OsType->id, $OsType->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $OsType->fill(collect($request->except([ 'company_id' ]))->only(OsType::getFillables())->toArray());

        if(!$OsType->hasAppliedChanges() || secureSave($OsType))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $OsType,
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
        $OsType = OsType::where('id', '=', $id)->first();

        if(!$OsType->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($OsType->secureDelete())
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
