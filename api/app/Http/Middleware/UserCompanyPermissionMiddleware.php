<?php

namespace App\Http\Middleware;

use App\Models\Company;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class UserCompanyPermissionMiddleware extends BaseMiddleware
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
        $validator = validate($request->all(), [
            'company_id' => 'required|integer',
        ]);
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
    
        if(!Company::where('id', '=', $request->company_id)->whereNull('deleted_at')->exists())
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ], Response::HTTP_NOT_FOUND
            );
        }
        
        if(
        !\DB::table('company_user')
            ->where('user_id', '=', \Auth::user()->id)
            ->where('company_id', '=', $request->company_id)
            ->exists()
        )
        {
            return response()->json([ 'msg' => '¡Unauthorized!' ], Response::HTTP_UNAUTHORIZED);
        }
        
        return $next($request);
    }
}
