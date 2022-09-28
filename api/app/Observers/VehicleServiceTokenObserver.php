<?php

namespace App\Observers;


use App\Jobs\SendEmailJob;
use App\Mail\VehicleServiceTokenEmail;
use App\Models\VehicleServiceToken;

class VehicleServiceTokenObserver
{
    public function created(VehicleServiceToken $token)
    {
        dispatch(new SendEmailJob([
                                      'to'                 => $token->email,
                                      'vehicle_service_id' => $token->vehicle_service_id,
                                      'type'               => 'service-schedules',
                                      'id'                 => $token->vehicleService->service_schedule_id,
                                      'checklist_id'       => $token->vehicleService->id,
                                      'company_id'         => $token->vehicleService->company_id,
                                      'token'              => $token->token,
                                  ],
                                  VehicleServiceTokenEmail::class));

        return true;
    }
}
