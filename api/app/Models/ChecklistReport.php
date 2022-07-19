<?php

namespace App\Models;


class ChecklistReport extends Base
{
    protected $table = 'checklist_reports';

    protected $appends = ['date'];

    protected $fillable = [
        'vehicle_service_id',
        'filename'
    ];

    public function getDateAttribute(){
        return $this->created_at;
    }

    #belongs to
    public function vehicleService()
    {
        return $this->belongsTo('App\Models\VehicleService', 'vehicle_service_id', 'id')->withTrashed();
    }
}

