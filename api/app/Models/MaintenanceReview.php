<?php

namespace App\Models;

class MaintenanceReview extends Base
{
    protected $table = 'maintenance_reviews';

    protected $fillable = [
        'company_id',
        'brand_id',
        'model_id',
        'name',
    ];

    public static function rules()
    {
        return [
            'name'    =>  [
                'required', 'string'
            ],
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id');
    }

    #belongs to
    public function model()
    {
        return $this->belongsTo('App\Models\VehicleModel', 'model_id', 'id');
    }
}

