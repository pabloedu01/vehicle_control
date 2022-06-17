<?php

namespace App\Models;

class TemporalFile extends Base
{
    protected $table         = 'temporal_files';
    protected $forceDeleting = true;

    protected $appends = [ 'full_name', 'url' ];

    public static $path = 'temporal-files';

    public function getFullNameAttribute()
    {
        return self::$path.'/'.$this->filename;
    }

    public function getUrlAttribute()
    {
        return \Storage::url($this->full_name);
    }

    public static function prepare($model, $key, $value)
    {
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'public');
        $localStorage = \Storage::disk('public');
        $gcsStorage   = \Storage::disk($gcsDriver);

        $newValue = null;

        if(!is_null($value) && strlen($value) > 0)
        {
            if(is_numeric($value))
            {
                $temporalFile = self::where('id', '=', $value)->first();

                $path     = $model->filePaths[$key] ?? \Str::plural(\Str::snake(class_basename($model)));
                $newValue = $path.'/'.$temporalFile->filename;

                $gcsStorage->put($newValue, $localStorage->read($temporalFile->full_name));
                $localStorage->delete($temporalFile->full_name);

                secureDelete($temporalFile);
            }
            else
            {
                $newValue = last(explode($gcsStorage->url(''), $value));
            }
        }

        return $newValue;
    }
}

