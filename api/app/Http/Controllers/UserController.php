<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validator = validate($request->all(), User::rules());

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $user = new User($request->only(User::getFillables()));

        if(secureSave($user))
        {
            return response()
                ->json([
                           'msg'  => '¡Success!',
                           'user' => $user,
                       ],
                       Response::HTTP_CREATED
                );
        }
        else
        {
            return response()
                ->json([
                           'msg' => '¡Error!',
                       ],
                       Response::HTTP_INTERNAL_SERVER_ERROR
                );
        }
    }
}
