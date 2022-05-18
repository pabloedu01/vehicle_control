<?php

use Illuminate\Support\Facades\Route;


Route::group([
                 'prefix'     => 'user',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::get('companies', [
        'uses' => 'UserController@companies',
    ]);

    Route::post('/', [
        'uses' => 'UserController@store',
    ]);

    Route::post('whoami', [
        'uses' => 'UserController@whoami',
    ]);
});
