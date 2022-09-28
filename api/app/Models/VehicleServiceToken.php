<?php

namespace App\Models;

use App\Observers\VehicleServiceTokenObserver;

class VehicleServiceToken extends Base
{
    protected $table = 'vehicle_service_tokens';

    protected $fillable = [
      'vehicle_service_id',
      'user_id',
      'email',
      'token'
    ];

    public static function boot()
    {
        parent::boot();

        self::observe(VehicleServiceTokenObserver::class, 2);
    }

    public static function rules()
    {
        return [
            'email'     => 'required|email',
        ];
    }

    #belongs to
    public function vehicleService()
    {
        return $this->belongsTo('App\Models\VehicleService', 'vehicle_service_id', 'id')->withTrashed();
    }
}

