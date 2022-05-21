<?php

namespace App\Http\Middleware;

use App\Models\VehicleBrandChecklistVersion;
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
        $data = array_merge($request->only([ 'id', 'version_id', 'vehicle_brand_checklist_version_id' ]), collect($request->route()->parameters())->only([ 'id', 'version_id', 'checklist_version_id' ])->toArray());

        if(isset($data['version_id'])){
            $data['id'] = $data['version_id'];
        }

        if(isset($data['checklist_version_id'])){
            $data['id'] = $data['checklist_version_id'];
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

        if(!VehicleBrandChecklistVersion::where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !VehicleBrandChecklistVersion::whereHas('company', function($query){
            return $query->whereHas('users', function($query){
                return $query->where('users.id', '=', \Auth::user()->id);
            });
        })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => trans('general.msg.unauthorized') ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
