<?php

namespace App\Http\Middleware;

use App\Models\VehicleBrand;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class VehicleBrandPermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'brand_id', 'vehicle_brand_id' ]), collect($request->route()->parameters())->only([ 'id', 'brand_id', 'vehicle_brand_id' ])->toArray());

        if(isset($data['brand_id'])){
            $data['id'] = $data['brand_id'];
        }

        if(isset($data['vehicle_brand_id'])){
            $data['id'] = $data['vehicle_brand_id'];
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

        if(!VehicleBrand::where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !VehicleBrand::whereHas('company', function($query){
            return $query->whereHas('users', function($query){
                return $query->where('users.id', '=', \Auth::user()->id);
            });
        })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => '¡Unauthorized!' ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
