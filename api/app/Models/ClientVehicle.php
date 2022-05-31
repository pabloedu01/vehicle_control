<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class ClientVehicle extends Base
{
    protected $table = 'client_vehicles';

    protected $fillable = [
        'chasis',
        'vehicle_id',
        'company_id',
        'color',
        'number_motor',
        'renavan',
        'plate',
        'mileage',
    ];

    public static function rules($id = null, $company_id = null)
    {
        $uniqueRule = self::getUniqueRule($id, ['company_id' => $company_id]);

        return [
            'chasis'       => ['required', 'string', $uniqueRule],
            'color'        => 'required|string',
            'number_motor' => ['required', 'string', $uniqueRule],
            'renavan'      => ['required', 'integer', $uniqueRule],
            'plate'        => ['required', 'string', $uniqueRule],
            'mileage'      => 'required|numeric',
        ];
    }

    #belongs to
    public function vehicle()
    {
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id');
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }
}

