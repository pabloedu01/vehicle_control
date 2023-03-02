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

    // quando criar verifique se ja existe um registro com o mesmo produto e recomendação
    public static function rules($id = null, $company_id = null)
    {
        return [
            'recommendation_id' => 'required|exists:recommendations,id',
            'service_id' => 'required|exists:services,id',
            'quantity' => 'required|integer',
        ];
    }


    

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
