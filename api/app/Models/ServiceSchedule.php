<?php

namespace App\Models;

use App\Traits\DynamicFiltersTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ServiceSchedule extends Base
{
    use DynamicFiltersTrait;

    protected $table = 'service_schedules';

    protected $fillable = [
        'code',
        'promised_date',
        'company_id',
        'technical_consultant_id',
        'client_id',
        'client_vehicle_id',
    ];

    protected $filterJoins = '
            INNER JOIN client_vehicles ON client_vehicles.id = service_schedules.client_vehicle_id
            INNER JOIN vehicles ON vehicles.id = client_vehicles.vehicle_id
            INNER JOIN vehicle_brands ON vehicle_brands.id = vehicles.brand_id
    ';

    protected $filters = [
        'date_scheduled_max' => ['type' => 'dateMax', 'column' => 'promised_date'],
        'date_scheduled_min' => ['type' => 'dateMin', 'column' => 'promised_date'],
        'plate' => ['model' => ClientVehicle::class],
        'chassi' => ['column' => 'chasis', 'model' => ClientVehicle::class],
        'client_name' => ['column' => 'name', 'model' => Client::class],
        'vehicle_brand' => ['column' => 'name', 'model' => VehicleBrand::class],
        'vehicle' => ['column' => 'name', 'model' => VehicleBrand::class],
    ];

    public function scopeList(Builder $query)
    {
        $request = app('request');

        return $query->withoutGlobalScope('orderByCreatedAt')
                     ->where('company_id', '=', $request->company_id)
                     ->dynamicFilter()
                     ->orderBy('promised_date', 'desc');
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function technicalConsultant()
    {
        return $this->belongsTo('App\Models\TechnicalConsultant', 'technical_consultant_id', 'id')->withTrashed();
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id')->withTrashed();
    }

    #belongs to
    public function clientVehicle()
    {
        return $this->belongsTo('App\Models\ClientVehicle', 'client_vehicle_id', 'id')->withTrashed();
    }

    #has many
    public function claimsService()
    {
        return $this->hasMany('App\Models\ClaimServiceServiceSchedule', 'service_schedule_id', 'id');
    }

    #has many
    public function vehicleServices()
    {
        return $this->hasMany('App\Models\VehicleService', 'service_schedule_id', 'id');
    }
}

