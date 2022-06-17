<?php

namespace App\Http\Middleware;

use App\Models\VehicleModel;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class VehicleModelPermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'model_id', 'vehicle_model_id' ]), collect($request->route()->parameters())->only([ 'id', 'model_id', 'vehicle_model_id' ])->toArray());

        if(isset($data['model_id'])){
            $data['id'] = $data['model_id'];
        }

        if(isset($data['vehicle_model_id'])){
            $data['id'] = $data['vehicle_model_id'];
        }

        $validator = validate($data, [
            'id' => 'required|integer',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        if(!VehicleModel::withTrashed()->where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !VehicleModel::withTrashed()->whereHas('brand', function($query){
            return $query->whereHas('company', function($query){
                return $query->whereHas('users', function($query){
                    return $query->where('users.id', '=', \Auth::user()->id);
                });
            });
        })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => trans('general.msg.unauthorized') ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
