<?php

namespace App\Models;

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
        $uniqueRule = self::getUniqueRule($id, ['company_id' => $company_id]);

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

