<?php

namespace App\Models;

class VehicleServiceClientData extends Base
{
    protected $table = 'vehicle_service_client_data';

    protected $forceDeleting = true;

    protected $fillable = [
        'vehicle_service_id',
        'client_id',
        'name',
    ];

    protected $changingColumns = [
        'client_name' => 'name',
    ];

    #belongs to
    public function vehicleService()
    {
        return $this->belongsTo('App\Models\VehicleService', 'vehicle_service_id', 'id')->withTrashed();
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id')->withTrashed();
    }
}

