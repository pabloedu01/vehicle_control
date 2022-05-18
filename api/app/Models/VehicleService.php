<?php

namespace App\Models;

class VehicleService extends Base
{
    protected $table = 'vehicle_services';

    protected $fillable = [
        'company_id',
        'version_id',
        'service_schedule_id',
        'service_order_id',
    ];

    protected $appends = ['client_name'];

    public static function boot()
    {
        parent::boot();

        self::bootJoinToData();
    }

    public static function bootJoinToData()
    {
        static::addGlobalScope('joinToData', function($query){
            return $query->select([
                                      'vehicle_services.*',

                                      'vehicle_service_client_data.client_id',
                                      'vehicle_service_client_data.name as client_name',
                                      'vehicle_service_client_data.signature as client_signature',
                                      'vehicle_service_client_data.signature_date as client_signature_date',

                                      'vehicle_service_technical_consultant_data.technical_consultant_id',
                                      'vehicle_service_technical_consultant_data.signature as technical_consultant_signature',
                                      'vehicle_service_technical_consultant_data.signature_date as technical_consultant_signature_date',

                                      'vehicle_service_vehicle_data.brand_id',
                                      /*'vehicle_service_vehicle_data.plate',*/
                                      'vehicle_service_vehicle_data.fuel',
                                      'vehicle_service_vehicle_data.mileage',
                                      /*'vehicle_service_vehicle_data.chasis'*/
                                  ])
                         ->join('vehicle_service_client_data', 'vehicle_services.id', '=', 'vehicle_service_client_data.vehicle_service_id', 'inner')
                         ->join('vehicle_service_technical_consultant_data', 'vehicle_services.id', '=', 'vehicle_service_technical_consultant_data.vehicle_service_id', 'inner')
                         ->join('vehicle_service_vehicle_data', 'vehicle_services.id', '=', 'vehicle_service_vehicle_data.vehicle_service_id', 'inner');
        });
    }

    public function getClientNameAttribute(){
        $client = $this->client;

        return $client ? $client->name : $this->getAttributeFromArray('client_name');
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function serviceSchedule()
    {
        return $this->belongsTo('App\Models\ServiceSchedule', 'service_schedule_id', 'id');
    }

    #belongs to
    public function technicalConsultant()
    {
        return $this->belongsTo('App\Models\TechnicalConsultant', 'technical_consultant_id', 'id');
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id');
    }

    #belongs to
    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id');
    }

    #belongs to
    public function version()
    {
        return $this->belongsTo('App\Models\VehicleBrandChecklistVersion', 'version_id', 'id');
    }

    #many to many
    public function items()
    {
        return $this->belongsToMany('App\Models\ChecklistItem', 'checklist_item_vehicle_service', 'vehicle_service_id', 'checklist_item_id')
            ->withPivot([ 'value', 'evidence' ])
            ->withTimestamps()
            ->using('App\Pivots\ChecklistItemVehicleService');
    }

    #has one
    public function clientData()
    {
        return $this->hasOne('App\Models\VehicleServiceClientData', 'vehicle_service_id', 'id');
    }

    #has one
    public function technicalConsultantData()
    {
        return $this->hasOne('App\Models\VehicleServiceTechnicalConsultantData', 'vehicle_service_id', 'id');
    }

    #has one
    public function vehicleData()
    {
        return $this->hasOne('App\Models\VehicleServiceVehicleData', 'vehicle_service_id', 'id');
    }
}

