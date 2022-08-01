<?php

namespace App\Http\Controllers;

use App\Events\Notifications;
use App\Jobs\SendEmailJob;
use App\Mail\WelcomeEmail;
use App\Models\Log;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TestController extends Controller
{
    public function test(Request $request)
    {
        /*$email = new SendEmail('test subject', 'test message');

        dd(\Mail::to('migueljosecontreras@gmail.com')
                ->send($email));*/

        \Mail::send('test', [ 'content' => 'this is a test message' ], function($message){
            $message->to(env('MAIL_FROM_ADDRESS_DEBUG'))
                    ->subject('test');
        });


        /*dispatch(new SendEmailJob([
                                      'to' => 'migueljosecontreras@gmail.com', 'code' => 'codigo'
                                  ], WelcomeEmail::class));*/

        Notifications::dispatch(\Auth::user(), 'hola');

        return response()->json([
                                    'msg' => trans('general.msg.success'),
                                    'data' => [],
                                ], Response::HTTP_OK
        );


        $log = new Log();

        $log->autor = 'Miguel Contreras';
        $log->text = 'test de envio';
        $log->tags = ['mongodb', 'php'];

        if(secureSave($log)){
            return response()->json([
                                        'msg' => trans('general.msg.success'),
                                        'data' => $log,
                                    ], Response::HTTP_OK
            );
        } else {
            return response()->json([
                                        'msg' => trans('general.msg.error'),
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
