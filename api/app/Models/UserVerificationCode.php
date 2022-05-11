<?php

namespace App\Models;

use Symfony\Component\HttpFoundation\Response;

class UserVerificationCode extends Base
{
    protected $table = 'user_verification_codes';

    protected $forceDeleting = true;

    protected $fillable = [
        'user_id',
        'code'
    ];

    #belongs to
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }

    public static function validate($code)
    {
        $userVerificationCode = self::where('code', '=', $code)
                                    ->first();

        if($userVerificationCode)
        {
            if(strtotime($userVerificationCode->created_at) >= strtotime('-100 minutes'))
            {
                return $userVerificationCode;
            }
            else
            {
                $userVerificationCode->delete();

                return response()
                    ->json([
                               'msg' => '¡Expired Code!',
                           ],
                           Response::HTTP_BAD_REQUEST
                    );
            }
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }
    }
}

