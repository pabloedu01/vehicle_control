<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class TechnicalConsultant extends Base
{
    protected $table = 'technical_consultants';

    protected $appends = ['name'];

    protected $casts = [
        'active' => 'boolean'
    ];

    protected $fillable = [
        'company_id',
        'user_id',
        'active',
        'name'
    ];

    public static function rules($company_id, $id = null)
    {
        return [
            'user_id' => [
                'nullable', 'integer',
                Rule::exists('company_user', 'user_id')->where('company_id', $company_id),
                self::getUniqueRule($id, ['company_id' => $company_id])
            ],
            'active' => 'required|boolean',
            'name' => 'required_without:user_id|nullable|string'
        ];
    }

    public function getNameAttribute(){
        $user = $this->user;

        return $user ? $user->name : $this->getAttributeFromArray('name');
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }


    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }

}

