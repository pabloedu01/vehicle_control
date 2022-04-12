<?php

namespace App\Observers;


use App\Jobs\SendEmailJob;
use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Models\UserVerificationCode;

class UserObserver
{
    public function created(User $user)
    {
        $code = \Str::random();
        
        if(UserVerificationCode::create([
            'code' => $code,
            'user_id' => $user->id
                                        ])){
            dispatch(new SendEmailJob([
                                          'to' => $user->email, 'code' => $code
                                      ], WelcomeEmail::class));
        }
        
        return true;
    }
}