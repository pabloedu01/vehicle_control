<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'checklist-version',
                 'middleware' => [ 'jwt.verify', 'user', 'admin' ],
             ], function(){

    Route::get('/', [
        'uses' => 'ChecklistVersionController@index',
    ]);

    Route::get('active-checklist-versions', [
        'uses' => 'ChecklistVersionController@activeVersions',
    ]);

    Route::post('/', [
        'uses' => 'ChecklistVersionController@store',
    ]);

    Route::group([
                     'prefix' => '{id}',
                     'middleware' => [ 'checklistVersion' ],
                 ], function(){

        Route::get('/', [
            'uses' => 'ChecklistVersionController@show',
        ]);

        Route::post('report', [
            'uses' => 'ChecklistVersionController@storeReport',
        ]);

        Route::post('duplicate', [
            'uses' => 'ChecklistVersionController@duplicate',
        ]);

        Route::put('/', [
            'uses' => 'ChecklistVersionController@update',
        ]);

        Route::delete('/', [
            'uses' => 'ChecklistVersionController@destroy',
        ]);
    });
});
