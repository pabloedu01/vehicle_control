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
                    ->where('users.active', '=', true)
                    ->orderBy('company_user.created_at', 'desc')
                    ->withTimestamps();
    }
    
    #has many
    public function products()
    {
        return $this->hasMany('App\Models\Product', 'company_id', 'id')
                    ->whereNull('deleted_at');
    }
}

