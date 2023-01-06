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

        Route::put('{id}', [
            'uses' => 'CompanyController@update',
        ]);

        Route::get('vehicles', [
            'uses' => 'CompanyController@vehicles',
        ]);

        Route::get('maintenance-reviews', [
            'uses' => 'CompanyController@maintenanceReviews',
        ]);

        Route::get('vehicle-models', [
            'uses' => 'CompanyController@vehicleModels',
        ]);

        Route::get('services', [
            'uses' => 'CompanyController@services',
        ]);

        Route::get('client-vehicles', [
            'uses' => 'CompanyController@clientVehicles',
        ]);

        Route::get('active-vehicles', [
            'uses' => 'CompanyController@activeVehicles',
        ]);

        Route::get('checklist-versions', [
            'uses' => 'CompanyController@vehicleBrandChecklistVersions',
        ]);

    });
});
