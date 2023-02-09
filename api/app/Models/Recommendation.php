<?php

namespace App\Models;

use App\Rules\ArrayIdsInDatabase;
use App\Rules\ChecklistVersionStages;
use Illuminate\Validation\Rule;

class Recommendation extends Base
{
    protected $table = 'recommendations';

    protected $fillable = [
        'company_id',
        'client_vehicle_id',
        'maintenance_review_id',
        'claim_service_id',
        'os_type_id',
        'name',
    ];

    public static function rules($company_id)
    {
        return [
            'vehicle_id'   => [
                'nullable',
                'integer',
                Rule::exists('client_vehicles', 'id')->where('company_id', $company_id),
            ],
            'maintenance_review_id'   => [
                'nullable',
                'integer',
                Rule::exists('maintenance_reviews', 'id')->where('company_id', $company_id),
            ],
            'claim_service_id'   => [
                'nullable',
                'integer',
                Rule::exists('claims_service', 'id')->where('company_id', $company_id),
            ],
            'os_type_id'   => [
                'nullable',
                'integer',
                Rule::exists('os_type', 'id')->where('company_id', $company_id),
            ],
            'name'    =>  [
                'required', 'string'
            ],

        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id')->withTrashed();
    }

    #belongs to
    public function vehicle()
    {
        return $this->belongsTo('App\Models\ClientVehicle', 'client_vehicle_id', 'id')->withTrashed();
    }

    #belongs to
    public function maintenanceReview()
    {
        return $this->belongsTo('App\Models\MaintenanceReview', 'maintenance_review_id', 'id')->withTrashed();
    }

    #belongs to
    public function claimService()
    {
        return $this->belongsTo('App\Models\ClaimService', 'claim_service_id', 'id')->withTrashed();
    }

    #belongs to
    public function osType()
    {
        return $this->belongsTo('App\Models\OsType', 'os_type_id', 'id')->withTrashed();
    }

    #many to many
    public function services()
    {
        return $this->belongsToMany('App\Models\Service', 'recommendation_service', 'recommendation_id', 'service_id')
                    ->withPivot([ 'value' ])
                    ->withTimestamps();
    }
    public function products()
    {
        return $this->belongsToMany('App\Models\Product', 'recommendation_product', 'recommendation_id', 'product_id')
                    ->withPivot([ 'value' ])
                    ->withTimestamps();
    }

}

