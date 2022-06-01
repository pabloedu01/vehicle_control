<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'technical-consultant',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){

        Route::get('/', [
            'uses' => 'TechnicalConsultantController@index',
        ]);

        Route::get('active-technical-consultants', [
            'uses' => 'TechnicalConsultantController@activeTechnicalConsultants',
        ]);

        Route::post('/', [
            'uses' => 'TechnicalConsultantController@store',
        ]);

        Route::get('available-users', [
            'uses' => 'TechnicalConsultantController@availableUsers',
        ]);

    });

    Route::group([
                     'middleware' => [ 'technicalConsultant' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'TechnicalConsultantController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'TechnicalConsultantController@update',
        ]);
    });


});
