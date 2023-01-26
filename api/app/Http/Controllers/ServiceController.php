<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::all();
        // ::where('service_type_id', '=', $request->service_type_id)
        //                    ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $services,
                                ],
                                Response::HTTP_OK
        );
    }

    public function activeServices(Request $request)
    {
        $services = Service:: where('active', '=', true)
        // ->where('service_type_id', '=', $request->service_type_id)
                           ->get();

        return response()->json([
                                    'msg'  => trans('general.msg.success'),
                                    'data' => $services,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $service = Service::where('id', '=', $id)->first();
        // ->with('serviceType')
                        
                          

        return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          'msg'  => trans('general.msg.success'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          'data' => $service,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ], Response::HTTP_OK
        );
    }

    public function store(Request $request)
    {
        $validator = validate($request->all(), Service::rules(null, $request->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $service = new Service($request->only(Service::getFillables()));

        if(secureSave($service))
        {
            return response()->json(   [
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $service,
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
        $service = Service::where('id', '=', $id)->first();

        $validator = validate($request->all(), Service::rules($service->id, $service->company_id));

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        $service->fill(collect($request->except([ 'company_id' ]))->only(Service::getFillables())->toArray());

        if(!$service->hasAppliedChanges() || secureSave($service))
        {
            return response()->json(   [
                                        'msg'  => trans('general.msg.success'),
                                        'data' => $service,
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
        $service = Service::where('id', '=', $id)->first();

        if(!$service->canBeDeleted())
        {
            return response()->json([
                                        'msg' => trans('general.msg.hasDependencies'),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if($service->secureDelete())
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
