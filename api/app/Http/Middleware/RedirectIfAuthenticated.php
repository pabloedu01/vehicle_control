<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @param string|null              ...$guards
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        #tomando data de las cabeceras del header
        $token    = $request->header('x-auth-token');
        $username = $request->header('x-auth-uid');
        
        if($token && $username)
        {
            if(
            User::where(filter_var($username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username', $username)
                ->whereHas('tokens', function($query) use ($token){
                    return $query->where('token', '=', $token);
                })
                ->exists()
            )
            {
                return response()->json([
                                            'msg' => '¡Unauthorized, only guest has access!',
                                        ], Response::HTTP_UNAUTHORIZED
                );
            }
        }
        
        return $next($request);
    }
}
