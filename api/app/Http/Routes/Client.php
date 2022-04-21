<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'client',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company'],
                 ], function(){




        Route::get('/', [
            'uses' => 'ClientController@index',
        ]);

        Route::post('/', [
            'uses' => 'ClientController@store',
        ]);


    });

    Route::group([
                     'middleware' => [ 'client'],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'ClientController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'ClientController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'ClientController@destroy',
        ]);
    });







});
