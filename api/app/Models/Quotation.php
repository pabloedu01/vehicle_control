<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\DynamicFiltersTrait;

class Quotation extends Model
{
    use DynamicFiltersTrait;

    protected $table = 'quotation';

    use HasFactory;

    protected $fillable = [

        'client_id',
        'vehicle_id',
        'maintenance_review_id',
        'consultant_id',
        'company_id',

    ];

    protected $filterJoins = '
    INNER JOIN client ON client.id = quotation.client_id
    INNER JOIN vehicles ON vehicles.id = quotation.vehicle_id
    INNER JOIN vehicle_brands ON vehicle_brands.id = vehicles.brand_id
';

protected $filters = [
    'review' => ['model' => MaintenanceReview::class],
    'client_name' => ['column' => 'name', 'model' => Client::class],
    'vehicle' => ['column' => 'name', 'model' => VehicleBrand::class],
];


    public function scopeList(Builder $query)
    {
        $request = app('request');

        return $query->withoutGlobalScope('orderByCreatedAt')
            ->where('company_id', '=', $request->company_id)
            ->dynamicFilter()
            ->orderBy('created_at', 'desc');
    }
    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #belongs to
    public function technicalConsultant()
    {
        return $this->belongsTo('App\Models\TechnicalConsultant', 'consultant_id', 'id')->withTrashed();
    }

    #belongs to
    public function client()
    {
        return $this->belongsTo('App\Models\Client', 'client_id', 'id')->withTrashed();
    }

    #has many
    public function vehicle()
    {
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id')->withTrashed();

    }

    #has many
    public function MaintenanceReview()
    {
        return $this->belongsTo('App\Models\MaintenanceReview', 'maintenance_review_id', 'id')->withTrashed();

        // return $this->hasMany('App\Models\MaintenanceReview', 'maintenance_review_id', 'id');
    }
    // has many quotation itens
    public function quotationItens()
    {
        return $this->hasMany('App\Models\QuotationItens', 'quotation_id', 'id');
    }
    // has many quotation claimservice
    public function quotationClaimService()
    {
        return $this->hasMany('App\Models\QuotationClaimService', 'quotation_id', 'id');
    }


}
