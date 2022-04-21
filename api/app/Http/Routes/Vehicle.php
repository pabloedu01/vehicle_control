<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'vehicle',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'vehicleModel' ],
                 ], function(){


        Route::get('/', [
            'uses' => 'VehicleController@index',
        ]);

        Route::post('/', [
            'uses' => 'VehicleController@store',
        ]);


    });

    Route::group([
                     'middleware' => [ 'vehicle' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'VehicleController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'VehicleController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'VehicleController@destroy',
        ]);
    });


});
