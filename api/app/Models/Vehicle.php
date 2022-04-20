<?php

namespace App\Models;

use Illuminate\Validation\Rule;

class Vehicle extends Base
{
    protected $table = 'vehicles';

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'model_id',
        'name',
        'model_year',
        'active',
    ];

    public static function rules($id = null, $model_id = null, $year = null)
    {
        if(!is_null($model_id) && !is_null($id) && !is_null($year))
        {
            $uniqueRule = Rule::unique(self::getTableName())->ignore($id, 'id')->where('model_id', $model_id)->where('model_year', $year);
        }
        else
        {
            if(!is_null($model_id) && !is_null($year))
            {
                $uniqueRule = Rule::unique(self::getTableName())->where('model_id', $model_id)->where('model_year', $year);
            }
            else
            {
                $uniqueRule = '';
            }
        }

        return [
            'name'       => [
                'required',
                'string',
                'max:100',
                $uniqueRule,
            ],
            'model_year' => 'required|integer',
            'active'     => 'required|boolean',
        ];
    }

    #belongs to
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    public function model()
    {
        return $this->belongsTo('App\Models\VehicleModel', 'model_id', 'id');
    }
}

