<?php

namespace App\Http\Middleware;

use App\Models\ChecklistVersion;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class ChecklistVersionPermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id' ]), collect($request->route()->parameters())->only([ 'id' ])->toArray());

        $validator = validate($data, [
            'id' => 'required|integer',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg' => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        if(!ChecklistVersion::withTrashed()->where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }

        return $next($request);
    }
}
