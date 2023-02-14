<?php

namespace App\Models;

use App\Casts\Json;
use App\Rules\ArrayEmail;
use App\Rules\ArrayInternacionalPhone;
use App\Rules\Document;

class Client extends Base
{
    protected $table = 'clients';

    protected $appends = ['fullName'];

    protected $casts = [
        'active' => 'boolean',
        'email' => Json::class,
        'phone' => Json::class,
    ];

    protected $fillable = [
        'company_id',
        'document',
        'name',
        'address',
        'email',
        'active',
        'phone'
    ];

    public static function rules($id = null, $company_id = null)
    {
        return [
            'name'     => 'required|string|max:100',
            'address'  => 'nullable|string',
            'email'  => ['nullable', 'array', new ArrayEmail],
            'phone'  => ['nullable', 'array', new ArrayInternacionalPhone],
            'document' => [
                'required',
                'string',
                'max:100',
                self::getUniqueRule($id, [ 'company_id' => $company_id ]),
                new Document
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
    public function quotation()
    {
        return $this->hasMany('App\Models\Quotation', 'client_id', 'id');
    }
}

