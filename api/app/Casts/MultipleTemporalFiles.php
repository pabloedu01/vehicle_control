<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class MultipleTemporalFiles implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        return json_decode($value, true);
    }

    public function set($model, $key, $value, $attributes)
    {
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'local');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $newValues = [];
        $values    = $value;

        if(is_array($values))
        {
            foreach($values as $value)
            {
                $newValue = \App\Models\TemporalFile::prepare($model, $key, $value);

                if(!is_null($newValue)){
                    $newValues[] = $newValue;
                }
            }
        }

        if($model->{$key} && is_array($model->{$key}) && count($model->{$key}) > 0)
        {
            $deletedFiles = array_diff($model->{$key},$newValues);

            foreach($deletedFiles as $deletedFile){
                if($gcsStorage->exists($deletedFile)){
                    $gcsStorage->delete($model->{$key});
                }
            }
        }

        return count($newValues) == 0 ? null : json_encode($newValues);
    }
}
