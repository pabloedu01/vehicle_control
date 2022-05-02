<?php

namespace App\Models;

class ServiceSchedule extends Base
{
    protected $table = 'service_schedules';

    protected $fillable = [
        'code',
        'promised_date',
        'company_id',
        'technical_consultant_id',
        'client_id',
        'vehicle_id',
    ];

    public static function getFillables()
    {
        return with(new static)->getFillable();
    }


    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function technicalConsultant()
    {
        return $this->belongsTo('App\Models\TechnicalConsultant', 'technical_consultant_id', 'id');
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id');
    }

    #belongs to
    public function vehicle()
    {
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id');
    }

    #has many
    public function claimsService()
    {
        return $this->hasMany('App\Models\ClaimServiceServiceSchedule', 'service_schedule_id', 'id');
    }
}

