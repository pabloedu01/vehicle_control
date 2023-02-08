<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'client-vehicle',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::get('search', [
        'uses' => 'ClientVehicleController@search',
    ]);

    Route::get('all', [
        'uses' => 'ClientVehicleController@all',
    ]);

    Route::group([
                     'middleware' => [ 'company' ],
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
