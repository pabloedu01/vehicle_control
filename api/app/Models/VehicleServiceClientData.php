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
        'signature',
        'signature_date',
    ];

    protected $changingColumns = [
        'client_name' => 'name',
        'client_signature' => 'signature',
        'client_signature_date' => 'signature_date'
    ];

    #belongs to
    public function vehicleService()
    {
        return $this->belongsTo('App\Models\VehicleService', 'vehicle_service_id', 'id');
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id');
    }
}

