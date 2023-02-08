<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationServices extends Model
{
    use HasFactory;
    protected $table = 'recommendation_services';

    protected $fillable = [
        'recommendation_id',
        'service_id',
        'quantity',
    ];


}
