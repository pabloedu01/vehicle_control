<?php

namespace App\Models;

use App\Rules\ArrayIdsInDatabase;

class VehicleBrandChecklistVersion extends Base
{
    protected $table = 'vehicle_brand_checklist_versions';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'brand_id',
        'code',
        'name',
        'description',
        'active',
    ];

    public static function rules()
    {
        return [
            'code'        => 'required|string|max:100',
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'active'      => 'required|boolean',
            'checklist'   => [
                'required',
                'array',
                new ArrayIdsInDatabase(ChecklistItem::class),
            ],
        ];
    }

    public function scopeVersion($query, $brand_id, $version_id = null)
    {
        $query = $query->where('brand_id', '=', $brand_id);

        if(!is_null($version_id))
        {
            return $query->where('id', '=', $version_id);
        }
        else
        {
            return $query->where('active', '=', true);
        }
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function brand()
    {
        return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id');
    }

    #many to many
    public function items()
    {
        /*
         * todo:
         * hay que colocar la posición del item, y el lugar en que vaya ubicado y probablemente el tipo de cómo se vaya a mostrar
         */
        return $this->belongsToMany('App\Models\ChecklistItem', 'checklist_item_vehicle_brand_checklist_version', 'version_id', 'item_id');
    }
}

