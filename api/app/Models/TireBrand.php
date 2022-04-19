<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class TireBrand extends Base
{
    protected $table = 'tire_brands';
    
    protected $fillable = [
        'company_id', 'name'
    ];
    
    public static function rules($id = null, $company_id = null)
    {
        if(!is_null($company_id) && !is_null($id))
        {
            $uniqueRule = Rule::unique('tire_brands')->ignore($id, 'id')->where('company_id', $company_id);
        }
        else
        {
            if(!is_null($company_id))
            {
                $uniqueRule = Rule::unique('tire_brands')->where('company_id', $company_id);
            }
            else
            {
                $uniqueRule = '';
            }
        }
        
        return [
            'name'     => [
                'nullable', 'string' , 'max:100',
                $uniqueRule,
            ],
        ];
    }
    
    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }
}

