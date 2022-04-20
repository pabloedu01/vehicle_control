<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class VehicleBrand extends Base
{
    protected $table = 'vehicle_brands';
    
    protected $casts = [
        'active' => 'boolean'
    ];
    
    protected $fillable = [
        'company_id',
        'name',
        'active',
    ];
    
    public static function rules($id = null, $company_id = null)
    {
        if(!is_null($company_id) && !is_null($id))
        {
            $uniqueRule = Rule::unique(self::getTableName())->ignore($id, 'id')->where('company_id', $company_id);
        }
        else
        {
            if(!is_null($company_id))
            {
                $uniqueRule = Rule::unique(self::getTableName())->where('company_id', $company_id);
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
}

