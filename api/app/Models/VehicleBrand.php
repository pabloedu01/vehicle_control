<?php

namespace App\Models;

use App\Casts\Slug;
use App\Casts\TemporalFile;

class VehicleBrand extends Base
{
    protected $table = 'vehicle_brands';

    protected $casts = [
        'active' => 'boolean',
        'code' => Slug::class,
        'image' => TemporalFile::class
    ];

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'active',
        'image'
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
                'required', 'string', 'regex:/^[a-zA-Z0-9\-\_]*$/',
                $uniqueRule,
            ],
            'active'      => 'required|boolean',
            'image' => ['nullable', new \App\Rules\TemporalFile]
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #has many
    public function models()
    {
        return $this->hasMany('App\Models\VehicleModel', 'brand_id', 'id');
    }
}

