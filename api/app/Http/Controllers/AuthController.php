<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailJob;
use App\Mail\RecoverPasswordEmail;
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
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $loginField = filter_var($request->username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        //$jwtToken = auth()->guard()->setTTL(60*24*365*10)->attempt([ $loginField => $request->username, 'password' => $request->password, 'active' => true ]);
        $jwtToken = auth()->attempt([ $loginField => $request->username, 'password' => $request->password, 'active' => true ]);


        $user = \Auth::user();

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
                                   'msg'   => trans('general.msg.success'),
                                   'token' => $token->token,
                               ],
                               Response::HTTP_OK
                        );
                }
                else
                {
                    return response()
                        ->json([
                                   'msg' => trans('general.msg.error'),
                               ],
                               Response::HTTP_INTERNAL_SERVER_ERROR
                        );
                }
            }
        }

        return response()->json([
                                    'msg' => trans('general.msg.unauthorized'),
                                ],
                                Response::HTTP_UNAUTHORIZED
        );
    }

    public function logout(Request $request)
    {
        $user = \Auth::user();

        $user->tokens()->delete();

        return response()
            ->json([
                       'msg' => trans('general.msg.success'),
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
                                        'msg' => trans('general.msg.unauthorized'),
                                    ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function register(Request $request)
    {
        $validator = validate($request->all(), array_merge([
                                                               'cnpj' => [ 'nullable', 'prohibits:cpf', new CNPJ, 'unique:companies,cnpj' ],
                                                               'cpf'  => [ 'required_without:cnpj', new CPF, 'unique:companies,cpf' ],
                                                           ], User::rules()));

        if($validator->fails())
        {
            return response()->json(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            'msg'    => trans('general.msg.invalidData'),
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
                ->json(   [
                           'msg'     => trans('general.msg.success'),
                           'user' => $user,
                           'company' => $company,
                       ], Response::HTTP_CREATED
                );
        }
        else
        {
            return response()
                ->json(   [
                           'msg' => trans('general.msg.error'),
                       ], Response::HTTP_INTERNAL_SERVER_ERROR
                );
        }
    }

    public function userVerificationCode(Request $request)
    {
        $result = UserVerificationCode::validate($request->code);

        if($result instanceof UserVerificationCode)
        {
            return response()
                ->json(   [
                           'msg' => trans('general.msg.success'),
                       ], Response::HTTP_OK
                );
        }
        else
        {
            return $result;
        }
    }

    public function activateUser(Request $request)
    {
        $result = UserVerificationCode::validate($request->code);

        if($result instanceof UserVerificationCode)
        {
            $userVerificationCode = $result;

            $user = $userVerificationCode->user;
            $userVerificationCode->delete();

            $user->active = true;

            if(secureSave($user))
            {
                return response()
                    ->json(   [
                               'msg' => trans('general.msg.success'),
                           ], Response::HTTP_OK
                    );
            }
            else
            {
                return response()
                    ->json(   [
                               'msg' => trans('general.msg.error'),
                           ], Response::HTTP_INTERNAL_SERVER_ERROR
                    );
            }
        }
        else
        {
            return $result;
        }
    }

    public function recoverPassword(Request $request)
    {
        $validator = validate($request->all(), [
            'email' => 'required|string|email',
        ]);

        if($validator->fails())
        {
            return response()->json([
                                        'msg'    => trans('general.msg.invalidData'),
                                        'errors' => $validator->errors(),
                                    ],
                                    Response::HTTP_BAD_REQUEST
            );
        }

        $user = User::where('email', '=', $request->email)->first();

        if($user)
        {
            if($user->active)
            {
                $code = \Str::random();

                if(UserVerificationCode::create([
                                                    'code'    => $code,
                                                    'user_id' => $user->id,
                                                ]))
                {
                    dispatch(new SendEmailJob([
                                                  'to'   => $user->email,
                                                  'code' => $code,
                                                  'user' => $user,
                                              ],
                                              RecoverPasswordEmail::class));

                    return response()
                        ->json([
                                   'msg' => trans('general.msg.success'),
                               ],
                               Response::HTTP_CREATED
                        );
                }
                else
                {
                    return response()
                        ->json([
                                   'msg' => trans('general.msg.error'),
                               ],
                               Response::HTTP_INTERNAL_SERVER_ERROR
                        );
                }
            }
            else
            {
                return response()->json([
                                            'msg' => trans('general.msg.userNotActive'),
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

    public function changePasswordByCode(Request $request)
    {
        $result = UserVerificationCode::validate($request->code);

        if($result instanceof UserVerificationCode)
        {
            $validator = validate($request->all(), [
                'password'        => 'required|string|min:6|max:12',
                'repeat_password' => 'required|same:password',
            ]);

            if($validator->fails())
            {
                return response()->json([
                                            'msg'    => trans('general.msg.invalidData'),
                                            'errors' => $validator->errors(),
                                        ],
                                        Response::HTTP_BAD_REQUEST
                );
            }

            $userVerificationCode = $result;

            $user = $userVerificationCode->user;
            $userVerificationCode->delete();

            $user->password = $request->password;

            if(secureSave($user))
            {
                return response()
                    ->json([
                               'msg' => trans('general.msg.success'),
                           ],
                           Response::HTTP_OK
                    );
            }
            else
            {
                return response()
                    ->json([
                               'msg' => trans('general.msg.error'),
                           ],
                           Response::HTTP_INTERNAL_SERVER_ERROR
                    );
            }
        }
        else
        {
            return $result;
        }
    }
}
