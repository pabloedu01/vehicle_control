<?php

namespace App\Http\Middleware;

use App\Models\MaintenanceReview;
use App\Models\Vehicle;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class MaintenanceReviewPermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'maintenance_review_id' ]), collect($request->route()->parameters())->only([ 'id', 'maintenance_review_id' ])->toArray());

        if(isset($data['maintenance_review_id'])){
            $data['id'] = $data['maintenance_review_id'];
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

        if(!MaintenanceReview::withTrashed()->where('id', '=', $data['id'])->exists())
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !MaintenanceReview::withTrashed()->whereHas('model', function($query){
            return $query->whereHas('brand', function($query){
                return $query->whereHas('company', function($query){
                    return $query->whereHas('users', function($query){
                        return $query->where('users.id', '=', \Auth::user()->id);
                    });
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
