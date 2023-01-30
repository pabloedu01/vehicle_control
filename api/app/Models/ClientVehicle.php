<?php

namespace App\Models;

use Illuminate\Validation\Rule;
use Laravel\Scout\Searchable;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;

class ClientVehicle extends Base
{
    use Searchable;

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
 /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
   // #[SearchUsingPrefix(['service_code', 'integration_code'])]
    #[SearchUsingFullText(['chasis','plate','vehicle.model.brand.name','vehicle.name', 'vehicle.model.name'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'vehicle.model.name' => $this->$this->vehicle->model->name,
            'vehicle.model.brand.name' => $this->vehicle->model->brand->name,
            'vehicle.name' => $this->$this->vehicle->name,
            'plate' => $this->plate,
            'chasis' => $this->chasis,
        ];
    }
    public static function rules($id = null, $company_id = null)
    {
        $uniqueRule = self::getUniqueRule($id, [ 'company_id' => $company_id ]);

        return [
            'vehicle_id'   => [
                'required',
                'integer',
                Rule::exists('vehicles', 'id')->where('company_id', $company_id),
            ],
            'chasis'       => [ 'nullable', 'string', 'regex:/^[a-zA-Z0-9]*$/', $uniqueRule ],
            'color'        => 'nullable|string',
            'number_motor' => [ 'nullable', 'string', 'regex:/^[a-zA-Z0-9]*$/', $uniqueRule ],
            'renavan'      => [ 'nullable', 'integer', $uniqueRule ],
            'plate'        => [ 'required', 'string', 'regex:/^[a-zA-Z0-9]*$/', $uniqueRule ],
            'mileage'      => 'nullable|numeric',
        ];
    }

    public function getNameAttribute(){
        return $this->vehicle->name. ' '.$this->vehicle->model_year. ' - '.strtoupper($this->plate).' (' . $this->vehicle->model->brand->name . ' - ' . $this->vehicle->model->name . ')';
    }

    #belongs to
    public function vehicle()
    {
        return $this->belongsTo('App\Models\Vehicle', 'vehicle_id', 'id')->withTrashed();
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    #has many
    public function serviceSchedules()
    {
        return $this->hasMany('App\Models\ServiceSchedule', 'client_vehicle_id', 'id');
    }
}

