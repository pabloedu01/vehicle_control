<?php

namespace App\Models;

class Client extends Base
{
    protected $table = 'clients';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'document',
        'name',
        'address',
        'active',
    ];

    public static function rules($id = null, $company_id = null)
    {
        return [
            'name'     => 'required|string|max:100',
            'address'  => 'required|string',
            'document' => [
                'required',
                'string',
                'max:100',
                self::getUniqueRule($id, [ 'company_id' => $company_id ]),
            ],
            'active'   => 'required|boolean',
        ];
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

