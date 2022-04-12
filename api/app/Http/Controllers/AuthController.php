<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Token;
use App\Models\User;
use App\Models\UserVerificationCode;
use App\Rules\CNPJ;
use App\Rules\CPF;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = validate($request->all(), [
            'username' => 'required|max:20',
            'password' => 'required|max:20',
        ]);
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
        
        $loginField = filter_var($request->username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        
        $jwtToken = auth()->attempt([ $loginField => $request->username, 'password' => $request->password, 'active' => true ]);
        $user     = \Auth::user();
        
        if($jwtToken && $user)
        {
            if(is_null($user->deleted_at))
            {
                $token = new Token();
                
                $token->token   = $jwtToken;
                $token->user_id = $user->id;
                $token->type    = 'user';
                $token->from    = 'myself';
                $token->date    = date('Y-m-d H:i:s');
                
                if(secureSave($token))
                {
                    return response()
                        ->json([
                                   'msg'   => '¡Success!',
                                   'token' => $token->token,
                               ], Response::HTTP_CREATED
                        );
                }
                else
                {
                    return response()
                        ->json([
                                   'msg' => '¡Error!',
                               ], Response::HTTP_INTERNAL_SERVER_ERROR
                        );
                }
            }
        }
        
        return response()->json([
                                    'msg' => '¡Unauthorized!',
                                ], Response::HTTP_UNAUTHORIZED
        );
    }
    
    public function logout(Request $request)
    {
        $user = \Auth::user();
        
        $user->tokens()->delete();
        
        return response()
            ->json([
                       'msg' => '¡Success!',
                   ], Response::HTTP_OK
            );
    }
    
    public function broadcasting(Request $request)
    {
        if(\Auth::check())
        {
            return response()->json(\Broadcast::auth($request), Response::HTTP_OK);
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Unauthorized!',
                                    ], Response::HTTP_UNAUTHORIZED);
        }
    }
    
    public function register(Request $request)
    {
        $validator = validate($request->all(), [
            'cnpj'     => [ 'nullable', 'prohibits:cpf', new CNPJ, 'unique:companies,cnpj' ],
            'cpf'      => [ 'required_without:cnpj', new CPF, 'unique:companies,cpf' ],
            'birthday' => 'nullable|date_format:d/m/Y',
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6|max:12',
        ]);
        
        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => '¡Invalid Data!',
                                        'errors' => $validator->errors(),
                                    ], Response::HTTP_BAD_REQUEST
            );
        }
        
        $user = new User($request->only([
                                            'user_id',
                                            'username',
                                            'password',
                                            'name',
                                            'email',
                                            'phone',
                                            'birthday',
                                        ]));
        
        $company = new Company($request->only([
                                                  'cnpj',
                                                  'cpf',
                                              ]));
        
        if(secureSave($user) && secureSave($company))
        {
            $user->companies()->attach($company->id, [ 'role' => 'owner' ]);
            
            return response()
                ->json([
                           'msg'     => '¡Success!',
                           'user'    => $user,
                           'company' => $company,
                       ], Response::HTTP_CREATED
                );
        }
        else
        {
            return response()
                ->json([
                           'msg' => '¡Error!',
                       ], Response::HTTP_INTERNAL_SERVER_ERROR
                );
        }
    }
    
    public function userVerificationCode(Request $request)
    {
        $userVerificationCode = UserVerificationCode::where('code', '=', $request->code)->first();
        
        if($userVerificationCode)
        {
            $user = $userVerificationCode->user;
            $userVerificationCode->delete();
            
            if($user->update([ 'active' => true ]))
            {
                return response()
                    ->json([
                               'msg' => '¡Success!',
                           ], Response::HTTP_CREATED
                    );
            }
            else
            {
                return response()
                    ->json([
                               'msg' => '¡Error!',
                           ], Response::HTTP_INTERNAL_SERVER_ERROR
                    );
            }
        }
        else
        {
            return response()->json([
                                        'msg' => '¡Not Found!',
                                    ], Response::HTTP_NOT_FOUND
            );
        }
    }
}
