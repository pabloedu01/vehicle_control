<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationClaimService extends Model
{
    use HasFactory;
    protected $table = 'recommendation_claim_service';

    protected $fillable = [
        'recommendation_id',
        'claim_service_id',
    ];
}
