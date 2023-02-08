<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationProducts extends Model
{
    use HasFactory;
    protected $table = 'recommendation_products';

    protected $fillable = [
        'recommendation_id',
        'product_id',
        'quantity',
    ];
}
