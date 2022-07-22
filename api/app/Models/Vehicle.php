<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class Vehicle extends Base
{
    protected $table = 'vehicles';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'brand_id',
        'model_id',
        'name',
        'model_year',
        'active',
    ];

    public static function rules($id = null, $company_id = null, $model_id = null, $year = null)
    {
        return [
            'name'       => [
                'required',
                'string',
                'max:100',
                self::getUniqueRule($id, ['model_id' => $model_id, 'model_year' => $year]),
            ],
            'model_id' => Rule::exists('vehicle_models', 'id')->where('company_id', $company_id),
            'model_year' => 'required|string',
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
        return $this->belongsTo('App\Models\VehicleModel', 'model_id', 'id')->withTrashed();
    }

    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id')->withTrashed();
    }

    #has many
    public function clientVehicles()
    {
        return $this->hasMany('App\Models\ClientVehicle', 'vehicle_id', 'id');
    }

    #has many
    public function vehicleServiceVehiclesData()
    {
        return $this->hasMany('App\Models\VehicleServiceVehicleData', 'vehicle_id', 'id');
    }
}

