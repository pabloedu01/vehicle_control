<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'service-schedule',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){
        Route::get('/', [
            'uses' => 'ServiceScheduleController@index',
        ]);

        Route::post('/', [
            'uses' => 'ServiceScheduleController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'serviceSchedule' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'ServiceScheduleController@show',
        ]);

        Route::get('{id}/vehicle-services', [
            'uses' => 'ServiceScheduleController@vehicleServices',
        ]);

        Route::put('{id}', [
            'uses' => 'ServiceScheduleController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'ServiceScheduleController@destroy',
        ]);
    });
});
