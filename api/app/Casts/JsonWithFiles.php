<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class JsonWithFiles implements CastsAttributes
{
    public function get($model,$key, $value, $attributes)
    {
        $gcsDriver  = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage = \Storage::disk($gcsDriver);

        $value = json_decode($value, true);

        $files = @$value['images'] ?? [];

        foreach($files as $index => $file){
            $files[$index] = $gcsStorage->exists($file) ? $gcsStorage->url($file) : null;
        }

        $value['images'] = $files;

        return $value;
    }

    public function set($model, $key, $value, $attributes)
    {
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $files = @$value['images'] ?? [];

        foreach($files as $index => $file){
            $newValue = \App\Models\TemporalFile::prepare($model, $key, $file);

            if(!is_null($model->{$key}) && !is_null(@$model->{$key}['images'][$index]) && strlen($model->{$key}['images'][$index]) > 0 && $model->{$key}['images'][$index] != $newValue && $gcsStorage->exists($model->{$key}['images'][$index]))
            {
                $gcsStorage->delete($model->{$key}['images'][$index]);
            }

            $files[$index] = $newValue;
        }

        $value['images'] = $files;

        return json_encode($value);
    }
}
