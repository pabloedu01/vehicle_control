<?php

namespace App\Models;

class VehicleBrand extends Base
{
    protected $table = 'vehicle_brands';

    protected $casts = [
        'active' => 'boolean'
    ];

    protected $fillable = [
        'company_id',
        'name',
        'active',
    ];

    public static function rules($id = null, $company_id = null)
    {
        return [
            'name'    => [
                'required', 'string' , 'max:100',
                self::getUniqueRule($id, ['company_id' => $company_id]),
            ],
            'active'      => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }
}

