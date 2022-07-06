<?php

namespace App\Models;

class VehicleModel extends Base
{
    protected $table = 'vehicle_models';

    protected $casts = [
        'active' => 'boolean'
    ];

    protected $fillable = [
        'company_id',
        'brand_id',
        'name',
        'active',
    ];

    public static function rules($id = null, $brand_id = null)
    {
        return [
            'name'    => [
                'required', 'string' , 'max:100',
                self::getUniqueRule($id, ['brand_id' => $brand_id]),
            ],
            'active'      => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id')->withTrashed();
    }

    #has many
    public function vehicles()
    {
        return $this->hasMany('App\Models\Vehicle', 'model_id', 'id');
    }
}

