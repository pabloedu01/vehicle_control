<?php

namespace App\Models;

class Client extends Base
{
    protected $table = 'clients';

    protected $appends = ['fullName'];

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'document',
        'name',
        'address',
        'email',
        'active',
    ];

    public static function rules($id = null, $company_id = null)
    {
        return [
            'name'     => 'required|string|max:100',
            'address'  => 'nullable|string',
            'email'  => 'nullable|string|email',
            'document' => [
                'required',
                'string',
                'max:100',
                self::getUniqueRule($id, [ 'company_id' => $company_id ]),
            ],
            'active'   => 'required|boolean',
        ];
    }

    public function getFullNameAttribute(){
        return $this->document.' - '.$this->name;
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #has many
    public function serviceSchedules()
    {
        return $this->hasMany('App\Models\ServiceSchedule', 'client_id', 'id');
    }

    #has many
    public function vehicleServiceClientsData()
    {
        return $this->hasMany('App\Models\VehicleServiceClientData', 'client_id', 'id');
    }
}

