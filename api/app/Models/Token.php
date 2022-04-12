<?php

namespace App\Models;

class Token extends Base
{
    protected $table = 'tokens';
    
    public $timestamps = false;
    
    public $hasLogs = false;
}

