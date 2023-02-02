<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'os',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){


        Route::get('/', [
            'uses' => 'OsTypeController@index',
        ]);

        Route::post('/', [
            'uses' => 'OsTypeController@store',
        ]);
    });

   

        Route::get('{id}', [
            'uses' => 'OsTypeController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'OsTypeController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'OsTypeController@destroy',
        ]);



});
