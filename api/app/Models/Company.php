<?php

namespace App\Models;

use App\Rules\CNPJ;
use App\Rules\CPF;

class Company extends Base
{
    protected $table = 'companies';

    protected $fillable = [
        'name',
        'cnpj',
        'cpf',
        'country',
        'city',
        'province',
        'address_1',
        'address_2',
        'integration_code'
    ];

    protected $changingColumns = [
        'company_name' => 'name',
    ];

    public static function rules()
    {
        return [
            'name'             => 'required|string|max:100',
            'cnpj'             => [ 'nullable', 'prohibits:cpf', new CNPJ, 'unique:companies,cnpj' ],
            'cpf'              => [ 'required_without:cnpj', new CPF, 'unique:companies,cpf' ],
            'country'          => 'required|string|max:100',
            'city'             => 'required|string|max:100',
            'province'         => 'required|string|max:100',
            'address_1'        => 'nullable|string',
            'address_2'        => 'nullable|string',
            'integration_code' => 'nullable|string',
        ];
    }

    #many to many
    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'company_user', 'company_id', 'user_id')
                    ->withPivot([ 'role', 'permissions' ])
                    ->where('users.active', '=', true)
                    ->orderBy('company_user.created_at', 'desc')
                    ->withTimestamps();
    }

    #has many
    public function products()
    {
        return $this->hasMany('App\Models\Product', 'company_id', 'id');
    }
}

