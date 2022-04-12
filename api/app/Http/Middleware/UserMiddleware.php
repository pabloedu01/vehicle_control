<?php

namespace App\Http\Middleware;

use App\Models\Token;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class UserMiddleware extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     * @return mixed
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    
    public function handle($request, Closure $next)
    {
        if(
        !Token::where('user_id', '=', \Auth::user()->id)
              ->where('from', '=', 'myself')
              ->where('type', '=', 'user')
              ->where('token', '=', \JWTAuth::getToken())
              ->where('date', '>=', date('Y-m-d H:i:s', strtotime('-'.config('jwt.ttl').' minutes')))
              ->exists()
        ){
            return response()->json(['msg' => 'Token is Expired'], Response::HTTP_UNAUTHORIZED);
        }
        
        return $next($request);
    }
}
