<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'maintenance-review',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'vehicleModel' ],
                 ], function(){


        Route::get('/', [
            'uses' => 'MaintenanceReviewController@index',
        ]);

        Route::post('/', [
            'uses' => 'MaintenanceReviewController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'maintenanceReview' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'MaintenanceReviewController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'MaintenanceReviewController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'MaintenanceReviewController@destroy',
        ]);
    });


});
