<?php

namespace App\Models;
use Laravel\Scout\Searchable;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;

class Service extends Base
{
    use Searchable;

    protected $table = 'services';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        // 'service_type_id',
        'service_code',
        'integration_code',
        'description',
        'standard_quantity',
        'standard_value',
        'active',
    ];
    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    #[SearchUsingPrefix(['service_code', 'integration_code'])]
    #[SearchUsingFullText(['description'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'service_code' => $this->service_code,
            'integration_code' => $this->integration_code,
            'description' => $this->description,
        ];
    }
    public static function rules($id = null, $company_id = null)
    {
        $uniqueRule = self::getUniqueRule($id, ['company_id' => $company_id]);

        return [
            'service_code'      => [
                'required',
                'string',
                'max:100',
                $uniqueRule,
            ],
            'integration_code'  => [
                'nullable',
                'integer',
                $uniqueRule,
            ],

            'description'       => 'nullable|string',
            'standard_quantity' => 'required|numeric',
            'standard_value'    => 'required|numeric',
            'active'            => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    // #belongs to
    // public function serviceType()
    // {
    //     return $this->belongsTo('App\Models\ServiceType', 'service_type_id', 'id');
    // }

    #has many
    public function servicesClaimServiceServiceSchedule()
    {
        return $this->hasMany('App\Models\ServiceClaimServiceServiceSchedule', 'service_id', 'id');
    }
}

