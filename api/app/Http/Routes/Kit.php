<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'kit',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

                Route::group([
                    'middleware' => [ 'company' ],
                ], function(){

                        Route::get('/', [
                            'uses' => 'KitController@index',
                        ]);
                        Route::put('/', [
                            'uses' => 'KitController@update',
                        ]);
                        Route::post('/', [
                            'uses' => 'KitController@store',
                        ]);
                  });
                    Route::get('/show/{id}', [
                        'uses' => 'KitController@show',
                    ]);
                    Route::delete('/{id}', [
                        'uses' => 'KitController@destroy',
                    ]);

});
