<?php

namespace App\Models;

class Service extends Base
{
    protected $table = 'services';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        // 'service_type_id',
        'service_code',
        'integration_code',
        'description',
        'standard_quantity',
        'standard_value',
        'active',
    ];

    public static function rules($id = null, $company_id = null)
    {
        $uniqueRule = self::getUniqueRule($id, ['company_id' => $company_id]);

        return [
            'service_code'      => [
                'required',
                'string',
                'max:100',
                $uniqueRule,
            ],
            'integration_code'  => [
                'nullable',
                'integer',
                $uniqueRule,
            ],
           
            'description'       => 'nullable|string',
            'standard_quantity' => 'required|numeric',
            'standard_value'    => 'required|numeric',
            'active'            => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    // #belongs to
    // public function serviceType()
    // {
    //     return $this->belongsTo('App\Models\ServiceType', 'service_type_id', 'id');
    // }

    #has many
    public function servicesClaimServiceServiceSchedule()
    {
        return $this->hasMany('App\Models\ServiceClaimServiceServiceSchedule', 'service_id', 'id');
    }
}

