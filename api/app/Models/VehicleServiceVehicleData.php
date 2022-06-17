<?php

namespace App\Models;

class VehicleServiceVehicleData extends Base
{
    protected $table = 'vehicle_service_vehicle_data';

    protected $forceDeleting = true;

    protected $fillable = [
        'vehicle_service_id',
        'vehicle_id',
        'brand_id',
        /*'plate',*/
        'fuel',
        'mileage',
        /*'chasis',*/
    ];

    #belongs to
    public function vehicleService()
    {
        return $this->belongsTo('App\Models\VehicleService', 'vehicle_service_id', 'id')->withTrashed();
    }

    #belongs to
    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id')->withTrashed();
    }

    #belongs to
    public function vehicle()
    {
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id')->withTrashed();
    }
}

