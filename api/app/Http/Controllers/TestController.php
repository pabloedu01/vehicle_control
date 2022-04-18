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
        
        dd(Log::get()->toArray());
        
        return response()->json([
                                    'msg'  => '¡Success!',
                                    'data' => [],
                                ], Response::HTTP_OK
        );
    }
}
