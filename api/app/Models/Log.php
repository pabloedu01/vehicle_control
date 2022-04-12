<?php

namespace App\Models;


use App\Casts\Json;
use Jenssegers\Mongodb\Eloquent\Model;

class Log extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'logs';
    public    $timestamps = false;
    
    protected $casts = [
        'data' => Json::class
    ];
    
    protected $hidden = [
        '_id'
    ];
}

