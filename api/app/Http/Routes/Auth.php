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
});