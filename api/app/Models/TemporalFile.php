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
}

