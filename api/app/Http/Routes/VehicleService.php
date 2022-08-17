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

        Route::get('{id}/reports', [
            'uses' => 'VehicleServiceController@reports',
        ]);

        Route::put('{id}', [
            'uses' => 'VehicleServiceController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'VehicleServiceController@destroy',
        ]);
    });
});
