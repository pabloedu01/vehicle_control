<?php

namespace App\Models;

use App\Casts\TemporalFile;

class VehicleService extends Base
{
    protected $table = 'vehicle_services';

    protected $hidden = [
        'deleted_at',
        'updated_at',
    ];

    protected $fillable = [
        'company_id',
        'checklist_version_id',
        'service_schedule_id',
        'service_order_id',
        'completed'
    ];

    protected $casts = [
        'technical_consultant_signature' => TemporalFile::class,
        'client_signature' => TemporalFile::class,
    ];

    public static $changingColumnsForReport = [
        'client_signature_base64'               => 'clientSignature',
        'client_signature_date'                 => 'clientSignatureDate',
        'technical_consultant_signature_base64' => 'technicalConsultantSignature',
        'technical_consultant_signature_date'   => 'technicalConsultantSignatureDate',
        'client_name'                           => 'clientName',
        'brand_name'                            => 'vehicleBrand',
        'model_name'                            => 'vehicleModel',
        'vehicle_name'                          => 'vehicleName',
        'plate'                                 => 'vehiclePlate',
        'chasis'                                => 'vehicleChasis',
        'schedule_date'                         => 'scheduleDate',
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

                                      'vehicle_service_vehicle_data.vehicle_id',
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

    public function getCanCompleteAttribute(){
        if($this->completed){
            return false;
        }

        $this->loadCount('items');

        $completedItemsCount = $this->items_count;
        $itemsCount = $this->checklistVersion->items->count();

        return $completedItemsCount >= $itemsCount && !is_null($this->client_signature) && !is_null($this->technical_consultant_signature);
    }

    public function getClientNameAttribute(){
        $client = $this->client;

        return $client ? $client->name : $this->getAttributeFromArray('client_name');
    }

    public function getClientSignatureBase64Attribute(){
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        return $this->client_signature ? 'data:image/png;base64,'.base64_encode($gcsStorage->get(last(explode($gcsStorage->url(''), $this->client_signature)))) : $this->client_signature;
    }

    public function getTechnicalConsultantSignatureBase64Attribute(){
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        return $this->technical_consultant_signature ? 'data:image/png;base64,'.base64_encode($gcsStorage->get(last(explode($gcsStorage->url(''), $this->technical_consultant_signature)))) : $this->technical_consultant_signature;
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function serviceSchedule()
    {
        return $this->belongsTo('App\Models\ServiceSchedule', 'service_schedule_id', 'id')->withTrashed();
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
    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id')->withTrashed();
    }

    #belongs to
    public function vehicle()
    {
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id')->withTrashed();
    }

    #belongs to
    public function checklistVersion()
    {
        return $this->belongsTo('App\Models\ChecklistVersion', 'checklist_version_id', 'id')->withTrashed();
    }

    #many to many
    public function items()
    {
        return $this->belongsToMany('App\Models\ChecklistItem', 'checklist_item_vehicle_service', 'vehicle_service_id', 'checklist_item_id')
            ->withTrashed()
            ->withPivot([ 'value', 'evidence', 'observations' ])
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

    #has many
    public function reports()
    {
        return $this->hasMany('App\Models\ChecklistReport', 'vehicle_service_id', 'id');
    }
}

