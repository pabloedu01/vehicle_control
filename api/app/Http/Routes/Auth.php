<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'middleware' => [ 'guest' ],
             ], function(){
    Route::post('login', [
        'uses' => 'AuthController@login',
    ]);

    Route::post('register', [
        'uses' => 'AuthController@register',
    ]);

    Route::post('user-verification-code', [
        'uses' => 'AuthController@userVerificationCode',
    ]);

    Route::post('activate-user', [
        'uses' => 'AuthController@activateUser',
    ]);

    Route::post('recover-password', [
        'uses' => 'AuthController@recoverPassword',
    ]);

    Route::post('change-password', [
        'uses' => 'AuthController@changePasswordByCode',
    ]);
});

Route::group([
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){
    Route::post('broadcasting/auth', [
        'uses'       => 'AuthController@broadcasting',
    ]);

    Route::post('logout', [
        'uses' => 'AuthController@logout',
    ]);

    Route::post('auth/check-token', [
        'uses' => 'AuthController@checkToken',
    ]);
});
