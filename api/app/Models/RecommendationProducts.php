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


    #belongs to
    public function recommendation()
    {
        return $this->belongsTo('App\Models\Recommendation', 'recommendation_id', 'id')->withTrashed();
    }

    #belongs to
    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id', 'id')->withTrashed();
    }

}
