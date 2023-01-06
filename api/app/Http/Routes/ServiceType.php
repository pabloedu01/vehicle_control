<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'service-type',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company'],
                 ], function(){




        Route::get('/', [
            'uses' => 'ServiceTypeController@index',
        ]);

        Route::post('/', [
            'uses' => 'ServiceTypeController@store',
        ]);


    });

    Route::group([
                     'middleware' => [ 'serviceType'],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'ServiceTypeController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'ServiceTypeController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'ServiceTypeController@destroy',
        ]);
    });







});
