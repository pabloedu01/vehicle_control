<?php

namespace App\Http\Middleware;

use App\Models\Company;
use App\Models\Permission;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class CompanyPermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'company_id' ]), collect($request->route()->parameters())->only([ 'id', 'company_id' ])->toArray());

        if(isset($data['company_id'])){
            $data['id'] = $data['company_id'];
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

        if(!Company::where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
            !Company::whereHas('users', function($query){
                $query = $query->where('users.id', '=', \Auth::user()->id);

                $routeName = \Route::currentRouteName();

                if(!is_null($routeName))
                {
                    $permission = Permission::where('code', '=', $routeName)->first();

                    if(!is_null($permission))
                    {
                        $query = $query->where(function($query) use ($permission){
                            return $query->whereIn('company_user.role', [ 'owner' ])
                                         ->orWhereRaw($permission->id.' = ANY ( ARRAY(SELECT json_array_elements_text( company_user.permissions ))::int[])');
                        });
                    }
                } else {
                    //todo: validar que mi invitado no tenga permisos vacios, porque independientemente si tiene la empresa compartida, pero no han fijado sus accesos, entonces que no pueda hacer nada en la empresa
                }

                return $query;
            })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => '¡Unauthorized!' ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
