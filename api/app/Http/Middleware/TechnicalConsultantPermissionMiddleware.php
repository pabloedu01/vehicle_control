<?php

namespace App\Http\Middleware;

use App\Models\TechnicalConsultant;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class TechnicalConsultantPermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'technical_consultant_id' ]), collect($request->route()->parameters())->only([
                                                                                                                                    'id',
                                                                                                                                    'technical_consultant_id',
                                                                                                                                ])->toArray());

        if(isset($data['technical_consultant_id']))
        {
            $data['id'] = $data['technical_consultant_id'];
        }

        $validator = validate($data, [
            'id' => 'required|integer',
        ]);

        if($validator->fails())
        {
            return response()->json(   [
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }

        if(!TechnicalConsultant::withoutGlobalScope('joinToData')
                               ->where('id', '=', $data['id'])->exists())
        {
            return response()->json(   [
                                        'msg' => '¡Not Found!',
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
            !TechnicalConsultant::withoutGlobalScope('joinToData')->whereHas('company', function($query){
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
