<?php

namespace App\Http\Middleware;

use App\Models\VehicleService;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class VehicleServicePermissionMiddleware extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @param string[]                 ...$guards
     *
     * @return mixed
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */

    public function handle($request, Closure $next)
    {
        $data = array_merge($request->only([ 'id', 'vehicle_service_id' ]), collect($request->route()->parameters())
            ->only([ 'id', 'vehicle_service_id' ])
            ->toArray());

        if(isset($data['vehicle_service_id']))
        {
            $data['id'] = $data['vehicle_service_id'];
        }

        $validator = validate($data, [
            'id' => 'required|integer',
        ]);

        if($validator->fails())
        {
            return response()->json(                                                                                                                                                                                                                                                                                                         [
                                                                                                                                                                                                                                                                                                                                              'msg' => trans('general.msg.invalidData'),
                                                                                                                                                                                                                                                                                                                                              'errors' => $validator->errors(),
                                                                                                                                                                                                                                                                                                                                          ], Response::HTTP_BAD_REQUEST
            );
        }

        $vehicleService = VehicleService::withoutGlobalScope('joinToData')->where('id', '=', $data['id'])->first();

        if(!$vehicleService)
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.notFound'),
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
            !VehicleService::withoutGlobalScope('joinToData')->whereHas('company', function($query){
                return $query->whereHas('users', function($query){
                    return $query->where('users.id', '=', \Auth::user()->id);
                });
            })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => trans('general.msg.unauthorized') ], Response::HTTP_UNAUTHORIZED);
        }

        $request->merge([
                            'company_id' => $vehicleService->company_id,
                            'brand_id' => @$request->get('brand_id') ?? $vehicleService->vehicleData->brand_id,
                            'checklist_version_id' => @$request->get('checklist_version_id') ?? $vehicleService->checklist_version_id
                        ]);

        return $next($request);
    }
}
