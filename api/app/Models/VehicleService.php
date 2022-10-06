<?php

namespace App\Models;

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

                                      'vehicle_service_technical_consultant_data.technical_consultant_id',

                                      'vehicle_service_vehicle_data.vehicle_id',
                                      'vehicle_service_vehicle_data.brand_id',
                                      'vehicle_service_vehicle_data.fuel',
                                      'vehicle_service_vehicle_data.mileage',
                                  ])
                         ->join('vehicle_service_client_data', 'vehicle_services.id', '=', 'vehicle_service_client_data.vehicle_service_id', 'inner')
                         ->join('vehicle_service_technical_consultant_data', 'vehicle_services.id', '=', 'vehicle_service_technical_consultant_data.vehicle_service_id', 'inner')
                         ->join('vehicle_service_vehicle_data', 'vehicle_services.id', '=', 'vehicle_service_vehicle_data.vehicle_service_id', 'inner');
        });
    }

    public function setCompleted($force = false){
        $eval = false;

        if(!$force){
            if(!$this->completed){
                $eval = true;
            }
        } else {
            $eval = true;
        }

        if($eval){
            $this->load('stages');

            $this->update(['completed' => $this->stages->filter(function($stage){return !$stage->pivot->completed || !$stage->pivot->processed;})->count() == 0]);
        }
    }

    public function getClientNameAttribute(){
        $client = $this->client;

        return $client ? $client->name : $this->getAttributeFromArray('client_name');
    }

    public function getNextStageAttribute(){
        if($this->completed){
            return $this->stages->first();
        } else {
            $lastStageProcessed = $this->stages->filter(function($stage){return $stage->pivot->processed;})->last();

            if($lastStageProcessed){
                $lastStageProcessedIndex = $this->stages->search(function($stage) use($lastStageProcessed){return $stage->id == $lastStageProcessed->id;});

                if($lastStageProcessedIndex != $this->stages->count() - 1){
                    return $this->stages[$lastStageProcessedIndex + 1];
                } else {
                    return $this->stages->last();
                }
            } else {
                return $this->stages->first();
            }
        }
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
            ->withPivot([ 'value', 'evidence', 'observations', 'checklist_item_id', 'vehicle_service_id' ])
            ->withTimestamps()
            ->using('App\Pivots\ChecklistItemVehicleService');
    }

    #many to many
    public function stages()
    {
        return $this->belongsToMany('App\Models\ChecklistVersionStage', 'checklist_version_stage_vehicle_service', 'vehicle_service_id', 'checklist_version_stage_id')
                    ->withTrashed()
                    ->withPivot([
                                    'technical_consultant_signature',
                                    'client_signature',
                                    'client_signature_date',
                                    'technical_consultant_signature_date',
                                    'completed',
                                    'processed',
                                ])
                    ->withTimestamps()
                    ->withoutGlobalScope('orderByCreatedAt')
                    ->orderBy('checklist_version_stage_vehicle_service.checklist_version_stage_id')
                    ->using('App\Pivots\ChecklistItemStageVehicleService');
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

