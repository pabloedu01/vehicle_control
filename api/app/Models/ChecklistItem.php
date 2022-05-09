<?php

namespace App\Models;

use App\Casts\Json;

class ChecklistItem extends Base
{
    protected $table = 'checklist_items';

    protected $casts = [
        'active'     => 'boolean',
        'is_default' => 'boolean',
        'validation' => Json::class,
    ];

    protected $fillable = [
        'is_default',
        'name',
        'description',
        'code',
        'active',
        'validation',
    ];

    public static function rules()
    {
        return [
            'is_default'  => 'required|boolean',
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'code'        => 'nullable|string|max:100',
            'active'      => 'required|boolean',
            'validation'  => 'required|array',
        ];
    }

    #many to many
    public function versions()
    {
        return $this->belongsToMany('App\Models\VehicleBrandChecklistVersion', 'checklist_item_vehicle_brand_checklist_version','item_id', 'version_id');
    }
}

