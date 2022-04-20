<?php

namespace App\Models;

use Illuminate\Validation\Rule;

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
        if(!is_null($brand_id) && !is_null($id))
        {
            $uniqueRule = Rule::unique(self::getTableName())->ignore($id, 'id')->where('brand_id', $brand_id);
        }
        else
        {
            if(!is_null($brand_id))
            {
                $uniqueRule = Rule::unique(self::getTableName())->where('brand_id', $brand_id);
            }
            else
            {
                $uniqueRule = '';
            }
        }

        return [
            'name'    => [
                'required', 'string' , 'max:100',
                $uniqueRule,
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
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id');
    }
}

