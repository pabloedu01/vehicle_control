<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class TemporalFile implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        return $value && $gcsStorage->exists($value) ? $gcsStorage->url($value) : null;
    }

    public function set($model, $key, $value, $attributes)
    {
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $newValue = \App\Models\TemporalFile::prepare($model, $key, $value);

        if(!is_null($model->{$key}) && strlen($model->{$key}) > 0 && $model->{$key} != $newValue && $gcsStorage->exists($model->{$key}))
        {
            $gcsStorage->delete($model->{$key});
        }

        return $newValue;
    }
}
