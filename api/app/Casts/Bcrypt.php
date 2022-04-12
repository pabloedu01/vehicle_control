<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Bcrypt implements CastsAttributes
{
    public function get($model,$key, $value, $attributes)
    {
        return $value;
    }
    
    public function set($model, $key, $value, $attributes)
    {
        return bcrypt($value);
    }
}