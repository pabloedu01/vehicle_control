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
        $localStorage = \Storage::disk('local');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $newValue = null;
        $oldModel = null;

        if($model->{$model->getKeyName()})
        {
            $oldModel = ( '\App\Models\\'.class_basename($model) )::select([ $model->getKeyName(), $key ])
                                                                  ->where($model->getKeyName(), '=', $model->{$model->getKeyName()})
                                                                  ->first();
        }

        if(!is_null($value) && strlen($value) > 0)
        {
            if(is_numeric($value))
            {
                $temporalFile = \App\Models\TemporalFile::where('id', '=', $value)->first();

                $path     = $model->filePaths[$key] ?? \Str::plural(\Str::snake(class_basename($model)));
                $newValue = $path.'/'.$temporalFile->filename;

                $gcsStorage->put($newValue, $localStorage->read($temporalFile->full_name));
                $localStorage->delete($temporalFile->full_name);

                secureDelete($temporalFile);
            }
            else
            {
                $newValue = $value;
            }
        }

        if($oldModel && !is_null($oldModel->{$key}) && strlen($oldModel->{$key}) > 0 && $oldModel->{$key} != $newValue && $gcsStorage->exists($oldModel->{$key}))
        {
            $gcsStorage->delete($oldModel->{$key});
        }

        return $newValue;
    }
}
