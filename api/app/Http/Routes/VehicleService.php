<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'vehicle-service',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){
    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){
        Route::get('/', [
            'uses' => 'VehicleServiceController@index',
        ]);

        Route::post('/', [
            'uses' => 'VehicleServiceController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'vehicleService' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'VehicleServiceController@show',
        ]);

        Route::post('{id}/duplicate', [
            'uses' => 'VehicleServiceController@duplicate',
        ]);

        Route::post('{id}/generate-token', [
            'uses' => 'VehicleServiceController@generateToken',
        ]);

        Route::put('{id}', [
            'uses' => 'VehicleServiceController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'VehicleServiceController@destroy',
        ]);
    });
});

Route::get('invite/vehicle-service/{id}', [
    'uses' => 'VehicleServiceController@show',
])->middleware(['vehicleServiceToken']);
