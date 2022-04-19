<?php

namespace App\Models;

use Illuminate\Validation\Rule;

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
        if(!is_null($company_id) && !is_null($id))
        {
            $uniqueRule = Rule::unique('products')->ignore($id, 'id')->where('company_id', $company_id);
        }
        else
        {
            if(!is_null($company_id))
            {
                $uniqueRule = Rule::unique('products')->where('company_id', $company_id);
            }
            else
            {
                $uniqueRule = '';
            }
        }
        
        return [
            'name'            => 'required|string|max:100',
            'product_code'    => 'required|string|max:100',
            'sale_value'      => 'required|numeric',
            'guarantee_value' => 'required|numeric',
            'unique_code'     => [
                'nullable', 'string' , 'max:100',
                $uniqueRule,
            ],
            'active'          => 'required|boolean',
        ];
    }
    
    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }
}

