<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'vehicle-brand',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){


        Route::get('/', [
            'uses' => 'VehicleBrandController@index',
        ]);

        Route::post('/', [
            'uses' => 'VehicleBrandController@store',
        ]);


    });

    Route::group([
                     'middleware' => [ 'vehicleBrand' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'VehicleBrandController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'VehicleBrandController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'VehicleBrandController@destroy',
        ]);
    });


});
