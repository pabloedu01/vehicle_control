<?php

namespace App\Models;

class ClaimServiceServiceSchedule extends Base
{
    protected $table = 'claim_service_service_schedule';

    protected $forceDeleting = true;

    protected $hidden = [
      'service_schedule_id',
      'created_at',
      'updated_at'
    ];

    protected $fillable = [
        'service_schedule_id',
        'claim_service_id',
    ];

    #has many
    public function services()
    {
        return $this->hasMany('App\Models\ServiceClaimServiceServiceSchedule', 'claim_service_service_schedule_id', 'id');
    }
}

