<?php

namespace App\Http\Controllers;

use App\Models\ClaimServiceServiceSchedule;
use App\Models\ServiceSchedule;
use App\Http\Requests\ServiceSchedule as ServiceScheduleRequest;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceScheduleController extends Controller
{
    private static $with = ['vehicle', 'client', 'technicalConsultant', 'technicalConsultant.user', 'claimsService','claimsService.services','claimsService.services.products'];

    public function index(Request $request)
    {
        $serviceSchedules = ServiceSchedule::with(collect(self::$with)->take(4)->toArray())
                                           ->where('company_id', '=', $request->company_id)
                                           ->get();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $serviceSchedules,
                                ],
                                Response::HTTP_OK
        );
    }

    public function show(Request $request, $id)
    {
        $serviceSchedule = ServiceSchedule::with(self::$with)
                                          ->where('id', '=', $id)
                                          ->first();

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => $serviceSchedule,
                                ],
                                Response::HTTP_OK
        );
    }

    public function store(ServiceScheduleRequest $request)
    {
        $serviceSchedule = new ServiceSchedule($request->only(ServiceSchedule::getFillables()));

        if(secureSave($serviceSchedule))
        {
            $this->saveClaimsService($serviceSchedule, $request->claims_service);

            $serviceSchedule->load(self::$with);

            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $serviceSchedule,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    private function saveClaimsService(ServiceSchedule $serviceSchedule, $claimsService)
    {
        if(is_array($claimsService) && count($claimsService) > 0)
        {
            ClaimServiceServiceSchedule::where('service_schedule_id', '=', $serviceSchedule->id)->delete();

            foreach($claimsService as $claimService)
            {
                if(isset($claimService['claim_service_id']))
                {
                    $claimServiceServiceSchedule = $serviceSchedule->claimsService()->create([
                                                                                                 'claim_service_id' => $claimService['claim_service_id'],
                                                                                             ]);

                    if(isset($claimService['services']) && is_array($claimService['services']))
                    {
                        foreach($claimService['services'] as $service)
                        {
                            if(isset($service['service_id']))
                            {
                                $serviceClaimServiceServiceSchedule = $claimServiceServiceSchedule->services()->create([
                                                                                                                           'service_id' => $service['service_id'],
                                                                                                                           'price'      => $service['price'],
                                                                                                                       ]);
                                if(isset($service['products']) && is_array($service['products']))
                                {
                                    foreach($service['products'] as $product)
                                    {
                                        if(isset($product['product_id']) && isset($product['price']) && is_numeric($product['price']))
                                        {
                                            $serviceClaimServiceServiceSchedule->products()->create([
                                                                                                        'product_id' => $product['product_id'],
                                                                                                        'price'      => $product['price'],
                                                                                                    ]);
                                        }

                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
    }

    public function update(ServiceScheduleRequest $request, $id)
    {
        $serviceSchedule = ServiceSchedule::where('id', '=', $id)->first();

        $serviceSchedule->fill($request->only(ServiceSchedule::getFillables()));

        if(!$serviceSchedule->hasAppliedChanges() || secureSave($serviceSchedule))
        {
            $this->saveClaimsService($serviceSchedule, $request->claims_service);

            $serviceSchedule->load(self::$with);

            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                        'data' => $serviceSchedule,
                                    ], Response::HTTP_CREATED
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function destroy(Request $request, $id)
    {
        $serviceSchedule = ServiceSchedule::where('id', '=', $id)->first();

        if(secureDelete($serviceSchedule))
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.success'),
                                    ], Response::HTTP_OK
            );
        }
        else
        {
            return response()->json(   [
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
