<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletingScope;

class ServiceSchedule extends Base
{
    protected $table = 'service_schedules';

    protected $fillable = [
        'code',
        'promised_date',
        'company_id',
        'checklist_version_id',
        'technical_consultant_id',
        'client_id',
        'client_vehicle_id',
    ];

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function checklistVersion()
    {
        return $this->belongsTo('App\Models\ChecklistVersion', 'checklist_version_id', 'id')->withTrashed();
    }

    #belongs to
    public function technicalConsultant()
    {
        return $this->belongsTo('App\Models\TechnicalConsultant', 'technical_consultant_id', 'id')->withTrashed();
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id')->withTrashed();
    }

    #belongs to
    public function clientVehicle()
    {
        return $this->belongsTo('App\Models\ClientVehicle', 'client_vehicle_id', 'id')->withTrashed();
    }

    #has many
    public function claimsService()
    {
        return $this->hasMany('App\Models\ClaimServiceServiceSchedule', 'service_schedule_id', 'id');
    }

    #has one
    public function vehicleService()
    {
        return $this->hasOne('App\Models\VehicleService', 'service_schedule_id', 'id')->withTrashed();
    }
}

