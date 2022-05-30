<?php

namespace App\Http\Middleware;

use App\Models\ServiceSchedule;
use Closure;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class ServiceSchedulePermissionMiddleware extends BaseMiddleware
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
        $data = array_merge($request->only([ 'id', 'service_schedule_id' ]), collect($request->route()->parameters())->only([ 'id', 'service_schedule_id' ])->toArray());

        if(isset($data['service_schedule_id'])){
            $data['id'] = $data['service_schedule_id'];
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

        $serviceSchedule = ServiceSchedule::where('id', '=', $data['id'])->first();

        if(!$serviceSchedule)
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ], Response::HTTP_NOT_FOUND
            );
        }

        if(
        !ServiceSchedule::whereHas('company', function($query){
            return $query->whereHas('users', function($query){
                return $query->where('users.id', '=', \Auth::user()->id);
            });
        })->where('id', '=', $data['id'])->exists()
        )
        {
            return response()->json([ 'msg' => trans('general.msg.unauthorized') ], Response::HTTP_UNAUTHORIZED);
        }

        $request->merge([
                            'company_id' => $serviceSchedule->company_id,
                        ]);

        return $next($request);
    }
}
