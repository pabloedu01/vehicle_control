<?php

namespace App\Models;

class ServiceType extends Base
{
    protected $table = 'service_types';

    protected $fillable = [
        'company_id',
        'code',
        'name',
        'description',
    ];

    public static function rules($id = null, $company_id = null)
    {
        $uniqueRule = self::getUniqueRule($id, ['company_id' => $company_id]);

        return [
            'code'    =>  [
                'nullable', 'string',
                $uniqueRule,
            ],
            'description'      =>  [
                'nullable', 'string'
            ],
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

    #has many
    public function services()
    {
        return $this->hasMany('App\Models\Services', 'service_type_id', 'id');
    }
}

