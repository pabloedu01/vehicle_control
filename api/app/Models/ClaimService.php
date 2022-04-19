<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class ClaimService extends Base
{
    protected $table = 'claims_service';
    
    protected $fillable = [
        'company_id',
        'integration_code',
        'description',
    ];
    
    public static function rules($id = null, $company_id = null)
    {
        if(!is_null($company_id) && !is_null($id))
        {
            $uniqueRule = Rule::unique('claims_service')->ignore($id, 'id')->where('company_id', $company_id);
        }
        else
        {
            if(!is_null($company_id))
            {
                $uniqueRule = Rule::unique('claims_service')->where('company_id', $company_id);
            }
            else
            {
                $uniqueRule = '';
            }
        }
        
        return [
            'integration_code'    =>  [
                'nullable', 'integer' ,
                $uniqueRule,
            ],
            'description'      =>  [
                'required', 'string',
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

