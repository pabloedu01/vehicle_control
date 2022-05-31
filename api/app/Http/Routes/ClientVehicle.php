<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'client-vehicle',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){


    Route::group([
                     'middleware' => [ 'vehicle' ],
                 ], function(){
        Route::get('/', [
            'uses' => 'ClientVehicleController@index',
        ]);

        Route::post('/', [
            'uses' => 'ClientVehicleController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'clientVehicle' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'ClientVehicleController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'ClientVehicleController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'ClientVehicleController@destroy',
        ]);
    });
});
