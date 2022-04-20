<?php

namespace App\Http\Middleware;

use App\Models\Vehicle;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class VehiclePermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'vehicle_id' ]), collect($request->route()->parameters())->only([ 'id', 'vehicle_id' ])->toArray());

        if(isset($data['vehicle_id'])){
            $data['id'] = $data['vehicle_id'];
        }

        $validator = validate($data, [
            'id' => 'required|integer',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        if(!Vehicle::where('id', '=', $data['id'])->whereNull('deleted_at')->exists())
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !Vehicle::whereHas('model', function($query){
            return $query->whereHas('brand', function($query){
                return $query->whereHas('company', function($query){
                    return $query->whereHas('users', function($query){
                        return $query->where('users.id', '=', \Auth::user()->id);
                    })->whereNull('companies.deleted_at');
                })->whereNull('vehicle_brands.deleted_at');
            })->whereNull('vehicle_models.deleted_at');
        })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => '¡Unauthorized!' ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
