<?php

namespace App\Models;

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
    ];
    
    #many to many
    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'company_user', 'company_id', 'user_id')
                    ->withPivot([ 'role' ])
                    ->whereNull('users.deleted_at')
                    ->orderBy('company_user.created_at', 'desc')
                    ->withTimestamps();
    }
}

