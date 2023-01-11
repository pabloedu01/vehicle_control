<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceTypeController extends Controller
{
    public function index(Request $request)
    {
        $serviceTypes = ServiceType::where('company_id', '=', $request->company_id)
                                     ->get();

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'msg' => trans('general.msg.success'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              'data' => $serviceTypes,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ], Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $serviceType = ServiceType::where('id', '=', $id)
                                    ->first();

        return response()->json(   [
                                    'msg' => trans('general.msg.success'),
                                    'data' => $serviceType,
                                ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), ServiceType::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $serviceType = new ServiceType($request->only(ServiceType::getFillables()));

        if(secureSave($serviceType))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $serviceType,
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
        $serviceType = ServiceType::where('id', '=', $id)->first();

        $validator = validate($request->all(), ServiceType::rules($serviceType->id, $serviceType->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $serviceType->fill(collect($request->except([ 'company_id' ]))->only(ServiceType::getFillables())->toArray());

        if(!$serviceType->hasAppliedChanges() || secureSave($serviceType))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $serviceType,
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
        $serviceType = ServiceType::where('id', '=', $id)->first();

        if(!$serviceType->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($serviceType->secureDelete())
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
