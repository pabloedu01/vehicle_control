<?php

use Illuminate\Support\Facades\Route;


Route::group([
                 'prefix'     => 'company',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::post('/', [
        'uses' => 'CompanyController@store',
    ]);

    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'CompanyController@show',
        ]);

        Route::get('vehicles', [
            'uses' => 'CompanyController@vehicles',
        ]);

        Route::get('checklist-versions', [
            'uses' => 'CompanyController@vehicleBrandChecklistVersions',
        ]);

    });
});
