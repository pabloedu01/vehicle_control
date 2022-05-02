<?php

namespace App\Models;

class ProductServiceClaimServiceServiceSchedule extends Base
{
    protected $table = 'product_service_claim_service_service_schedule';

    protected $forceDeleting = true;

    protected $hidden = [
        'service_claim_service_service_schedule_id',
        'created_at',
        'updated_at'
    ];

    protected $fillable = [
        'service_claim_service_service_schedule_id',
        'product_id',
        'price'
    ];
}

