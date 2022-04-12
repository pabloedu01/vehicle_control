<?php

namespace App\Models;

class UserVerificationCode extends Base
{
    protected $table = 'user_verification_codes';
    
    protected $fillable = [
        'user_id',
        'code'
    ];
    
    #belongs to
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }
}

