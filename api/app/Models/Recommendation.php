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
        'vehicle_id',
        'brand_id',
        'model_id',
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
                Rule::exists('vehicles', 'id')->where('company_id', $company_id),
            ],
            'brand_id'   => [
                'nullable',
                'integer',
                Rule::exists('vehicle_brands', 'id')->where('company_id', $company_id),
            ],
            'model_id'   => [
                'nullable',
                'integer',
                Rule::exists('vehicle_models', 'id')->where('company_id', $company_id),
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
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id')->withTrashed();
    }
     #belongs to
     public function model()
     {
         return $this->belongsTo('App\Models\VehicleModel', 'model_id', 'id')->withTrashed();
     }
     public function brand()
     {
         return $this->belongsTo('App\Models\VehicleBrand', 'brand_id', 'id')->withTrashed();
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
    #has many products
    public function products()
    {
        return $this->hasMany('App\Models\RecommendationProducts', 'recommendation_id', 'id');
    }
    #has many services
    public function services()
    {
        return $this->hasMany('App\Models\RecommendationServices', 'recommendation_id', 'id');
    }

}

