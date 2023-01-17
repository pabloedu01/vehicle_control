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
        'review_id',
        'consultant_id',
        'observation',

    ];

    protected $filterJoins = '
    INNER JOIN client_vehicles ON client_vehicles.id = service_schedules.client_vehicle_id
    INNER JOIN vehicles ON vehicles.id = client_vehicles.vehicle_id
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

    #belongs to
    public function clientVehicle()
    {
        return $this->belongsTo('App\Models\ClientVehicle', 'client_vehicle_id', 'id')->withTrashed();
    }

    #has many
    public function vehicle()
    {
        return $this->hasMany('App\Models\Vehicles', 'vehicle_id', 'id');
    }

    #has many
    public function Review()
    {
        return $this->hasMany('App\Models\MaintenanceReviews', 'maintenance_review_id', 'id');
    }

}
