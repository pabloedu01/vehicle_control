<?php

namespace App\Models;

class Vehicle extends Base
{
    protected $table = 'vehicles';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'model_id',
        'name',
        'model_year',
        'active',
    ];

    public static function rules($id = null, $model_id = null, $year = null)
    {
        return [
            'name'       => [
                'required',
                'string',
                'max:100',
                self::getUniqueRule($id, ['model_id' => $model_id, 'model_year' => $year]),
            ],
            'model_year' => 'required|integer',
            'active'     => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    public function model()
    {
        return $this->belongsTo('App\Models\VehicleModel', 'model_id', 'id');
    }
}

