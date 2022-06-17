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
        return $this->belongsTo('App\Models\User', 'user_id', 'id')->withTrashed();
    }

    public static function validate($code)
    {
        $userVerificationCode = self::where('code', '=', $code)
                                    ->first();

        if($userVerificationCode)
        {
            if(strtotime($userVerificationCode->created_at) >= strtotime('-10 minutes'))
            {
                return $userVerificationCode;
            }
            else
            {
                $userVerificationCode->delete();

                return response()
                    ->json([
                               'msg' => trans('general.msg.expiredCode'),
                           ],
                           Response::HTTP_BAD_REQUEST
                    );
            }
        }
        else
        {
            return response()->json([
                                        'msg' => trans('general.msg.notFound'),
                                    ],
                                    Response::HTTP_NOT_FOUND
            );
        }
    }
}

