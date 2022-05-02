<?php

namespace App\Models;

class ServiceClaimServiceServiceSchedule extends Base
{
    protected $table = 'service_claim_service_service_schedule';

    protected $forceDeleting = true;

    protected $hidden = [
        'claim_service_service_schedule_id',
        'created_at',
        'updated_at'
    ];

    protected $fillable = [
        'claim_service_service_schedule_id',
        'service_id',
        'price'
    ];

    #has many
    public function products()
    {
        return $this->hasMany('App\Models\ProductServiceClaimServiceServiceSchedule', 'service_claim_service_service_schedule_id', 'id');
    }
}

