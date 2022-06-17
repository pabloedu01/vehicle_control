<?php

namespace App\Models;

use App\Casts\TemporalFile;

class VehicleServiceTechnicalConsultantData extends Base
{
    protected $table = 'vehicle_service_technical_consultant_data';

    protected $forceDeleting = true;

    public $filePaths = [
        'signature' => 'vehicle-services/technical-consultants/signatures'
    ];

    protected $casts = [ 'signature' => TemporalFile::class ];

    protected $fillable = [
        'vehicle_service_id',
        'technical_consultant_id',
        'signature',
        'signature_date',
    ];

    protected $changingColumns = [
        'technical_consultant_signature' => 'signature',
        'technical_consultant_signature_date' => 'signature_date'
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

