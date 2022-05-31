<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'vehicle-model',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'vehicleBrand' ],
                 ], function(){
        Route::get('/', [
            'uses' => 'VehicleModelController@index',
        ]);
        Route::get('active-vehicle-models', [
            'uses' => 'VehicleModelController@activeVehicleModels',
        ]);

        Route::post('/', [
            'uses' => 'VehicleModelController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'vehicleModel' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'VehicleModelController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'VehicleModelController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'VehicleModelController@destroy',
        ]);
    });


});
