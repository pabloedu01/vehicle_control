<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationServices extends Model
{
    use HasFactory;
    protected $table = 'recommendation_service';

    protected $fillable = [
        'recommendation_id',
        'service_id',
        'quantity',
    ];



    #belongs to
    public function recommendation()
    {
        return $this->belongsTo('App\Models\Recommendation', 'recommendation_id', 'id')->withTrashed();
    }

    #belongs to
    public function service()
    {
        return $this->belongsTo('App\Models\Service', 'service_id', 'id')->withTrashed();
    }



}
