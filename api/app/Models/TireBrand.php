<?php

namespace App\Models;

class TireBrand extends Base
{
    protected $table = 'tire_brands';

    protected $fillable = [
        'company_id', 'name'
    ];

    public static function rules($id = null, $company_id = null)
    {
        return [
            'name'     => [
                'nullable', 'string' , 'max:100',
                self::getUniqueRule($id, ['company_id' => $company_id]),
            ],
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }
}

