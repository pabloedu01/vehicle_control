<?php

namespace App\Models;

class TemporalFile extends Base
{
    protected $table = 'temporal_files';
    protected $forceDeleting = true;

    protected $appends = ['full_name'];

    public static $path = 'temporal-files';

    public function getFullNameAttribute(){
        return self::$path.'/'.$this->filename;
    }

    public static function prepare($model, $key, $value){
        $gcsDriver    = env('GOOGLE_CLOUD_STORAGE_DRIVER', 'local');
        $localStorage = \Storage::disk('local');
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
                $newValue = $value;
            }
        }

        return $newValue;
    }
}

