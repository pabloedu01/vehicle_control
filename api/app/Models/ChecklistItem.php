<?php

namespace App\Models;

use App\Casts\Json;
use App\Casts\JsonWithFiles;

class ChecklistItem extends Base
{
    protected $table = 'checklist_items';
    protected $appends = ['formatted_name'];

    protected $casts = [
        'active'     => 'boolean',
        'validation' => JsonWithFiles::class,
        'preview_data' => Json::class,
    ];

    protected $fillable = [
        'name',
        'description',
        'code',
        'active',
        'validation',
        'preview_data'
    ];

    public static function rules()
    {
        return [
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'code'        => 'nullable|string|regex:/^[a-zA-Z0-9\-\_]*$/|max:100',
            'active'      => 'required|boolean',
            'validation'  => 'required|array',
            'preview_data'  => 'required|array',
        ];
    }

    public function getFormattedNameAttribute(){
        return \Str::camel(\Str::slug($this->name, ' '));
    }

    #many to many
    public function vehicleServices()
    {
        return $this->belongsToMany('App\Models\VehicleService', 'checklist_item_vehicle_service', 'checklist_item_id', 'vehicle_service_id')
                    ->withPivot([ 'value', 'evidence', 'observations' ])
                    ->withTimestamps()
                    ->using('App\Pivots\ChecklistItemVehicleService');
    }
}

