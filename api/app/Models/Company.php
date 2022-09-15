<?php

namespace App\Models;

use App\Casts\TemporalFile;
use App\Rules\CNPJ;
use App\Rules\CPF;

class Company extends Base
{
    protected $table = 'companies';

    protected $casts = [
        'image' => TemporalFile::class
    ];

    protected $fillable = [
        'name',
        'cnpj',
        'cpf',
        'country',
        'city',
        'province',
        'address_1',
        'address_2',
        'integration_code',
        'image'
    ];

    protected $changingColumns = [
        'company_name' => 'name',
    ];

    public static function rules($id = null)
    {
        return [
            'name'             => 'required|string|max:100',
            'cnpj'             => [ 'nullable', 'prohibits:cpf', new CNPJ, self::getUniqueRule($id) ],
            'cpf'              => [ 'required_without:cnpj', new CPF, self::getUniqueRule($id) ],
            'country'          => 'required|string|max:100',
            'city'             => 'required|string|max:100',
            'province'         => 'required|string|max:100',
            'address_1'        => 'nullable|string',
            'address_2'        => 'nullable|string',
            'integration_code' => 'nullable|string',
            'image' => ['nullable', new \App\Rules\TemporalFile]
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

