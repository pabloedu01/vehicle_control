<?php

namespace App\Models;

class Token extends Base
{
    protected $table = 'tokens';

    public $timestamps = false;

    static $hasLogs = false;
}

