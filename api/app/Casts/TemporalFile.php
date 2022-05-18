<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class TemporalFile implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        return $value;
    }

    public function set($model, $key, $value, $attributes)
    {
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'local');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $newValue = \App\Models\TemporalFile::prepare($model, $key, $value);

        if(!is_null($model->{$key}) && strlen($model->{$key}) > 0 && $model->{$key} != $newValue && $gcsStorage->exists($model->{$key}))
        {
            $gcsStorage->delete($model->{$key});
        }

        return $newValue;
    }
}
