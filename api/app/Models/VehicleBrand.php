<?php

namespace App\Models;

use App\Casts\Slug;

class VehicleBrand extends Base
{
    protected $table = 'vehicle_brands';

    protected $casts = [
        'active' => 'boolean',
        'code' => Slug::class
    ];

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'active',
    ];

    public static function rules($id = null, $company_id = null)
    {
        $uniqueRule = self::getUniqueRule($id, ['company_id' => $company_id]);

        return [
            'name'    => [
                'required', 'string' , 'max:100',
                $uniqueRule,
            ],
            'code'    => [
                'required', 'string' ,
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
}

