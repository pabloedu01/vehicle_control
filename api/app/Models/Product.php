<?php

namespace App\Models;

class Product extends Base
{
    protected $table = 'products';

    protected $casts = [
        'active' => 'boolean'
    ];

    protected $fillable = [
        'company_id',
        'name',
        'product_code',
        'sale_value',
        'guarantee_value',
        'unique_code',
        'active',
    ];

    public static function rules($id = null, $company_id = null)
    {
        return [
            'name'            => 'required|string|max:100',
            'product_code'    => 'required|string|max:100',
            'sale_value'      => 'required|numeric',
            'guarantee_value' => 'required|numeric',
            'unique_code'     => [
                'nullable', 'string' , 'max:100',
                self::getUniqueRule($id, ['company_id' => $company_id]),
            ],
            'active'          => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #has many
    public function productsServiceClaimServiceServiceSchedule()
    {
        return $this->hasMany('App\Models\ProductServiceClaimServiceServiceSchedule', 'product_id', 'id');
    }
}

