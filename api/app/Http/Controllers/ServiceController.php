<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::where('company_id', '=', $request->company_id)
                           ->whereNull('deleted_at')
                           ->get();
        
        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $services,
                                ], Response::HTTP_OK
        );
    }
    
    public function show(Request $request)
    {
        $service = Service::where('id', '=', $request->id)
                           ->first();
        
        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => $service,
                                ], Response::HTTP_OK
        );
    }
    
    public function store(Request $request)
    {
        $validator = validate($request->all(), Service::rules(null, $request->company_id));
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
        
        $service = new Service($request->only(Service::getFillables()));
        
        if(secureSave($service))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $service,
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
    
    public function update(Request $request)
    {
        $service = Service::where('id', '=', $request->id)->first();
        
        $validator = validate($request->all(), Service::rules($service->id, $service->company_id));
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
        
        $service->fill(collect($request->except([ 'company_id' ]))->only(Service::getFillables())->toArray());
        
        if(!$service->hasAppliedChanges() || secureSave($service))
        {
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $service,
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
    
    public function destroy(Request $request)
    {
        $service = Service::where('id', '=', $request->id)->first();
        
        if(secureDelete($service))
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
