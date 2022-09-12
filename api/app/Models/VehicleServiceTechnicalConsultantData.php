<?php

namespace App\Models;

class VehicleServiceTechnicalConsultantData extends Base
{
    protected $table = 'vehicle_service_technical_consultant_data';

    protected $forceDeleting = true;

    protected $fillable = [
        'vehicle_service_id',
        'technical_consultant_id',
    ];

    #belongs to
    public function vehicleService()
    {
        return $this->belongsTo('App\Models\VehicleService', 'vehicle_service_id', 'id')->withTrashed();
    }

    #belongs to
    public function technicalConsultant()
    {
        return $this->belongsTo('App\Models\TechnicalConsultant', 'technical_consultant_id', 'id')->withTrashed();
    }
}

