<?php

namespace App\Http\Middleware;

use App\Models\ClientVehicle;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class ClientVehiclePermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'client_vehicle_id' ]), collect($request->route()->parameters())->only([ 'id', 'client_vehicle_id' ])->toArray());

        if(isset($data['client_vehicle_id'])){
            $data['id'] = $data['client_vehicle_id'];
        }

        $validator = validate($data, [
            'id' => 'nullable|integer',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        if(!ClientVehicle::where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !ClientVehicle::whereHas('company', function($query){
            return $query->whereHas('users', function($query){
                return $query->where('users.id', '=', \Auth::user()->id);
            });
        })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => trans('general.msg.unauthorized') ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
