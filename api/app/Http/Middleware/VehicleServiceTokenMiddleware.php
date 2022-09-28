<?php

namespace App\Http\Middleware;

use App\Models\VehicleServiceToken;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class VehicleServiceTokenMiddleware extends BaseMiddleware
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
        if(
            $request->has('token') && $request->route()->hasParameter('id') && VehicleServiceToken::where('token', '=', $request->token)
                                                                                                 ->where('created_at', '>=', date('Y-m-d H:i:s', strtotime('-24 hours')))
                                                                                                 ->where('vehicle_service_id', '=', $request->route()
                                                                                                                                            ->parameter('id'))
                                                                                                 ->exists())
        {
            return $next($request);
        }

        return response()->json([ 'msg' => trans('general.msg.unauthorized') ], Response::HTTP_UNAUTHORIZED);
    }
}
