<?php

namespace App\Http\Controllers;

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


        /*dispatch(new SendEmailJob([
                                      'to' => 'migueljosecontreras@gmail.com', 'code' => 'codigo'
                                  ], WelcomeEmail::class));*/

        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => Log::limit(10)->orderBy('_id','desc')->get(),
                                ], Response::HTTP_OK
        );


        $log = new Log();

        $log->autor = 'Miguel Contreras';
        $log->text = 'test de envio';
        $log->tags = ['mongodb', 'php'];

        if(secureSave($log)){
            return response()->json([
                                        'msg'  => '¡Success!',
                                        'data' => $log,
                                    ], Response::HTTP_OK
            );
        } else {
            return response()->json([
                                        'msg'  => '¡Error!',
                                    ], Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
