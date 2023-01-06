<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'recommendation',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

    Route::group([
                     'middleware' => [ 'company' ],
                 ], function(){


        Route::get('/', [
            'uses' => 'RecommendationController@index',
        ]);

        Route::post('/', [
            'uses' => 'RecommendationController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'recommendation' ],
                 ], function(){

        Route::get('{id}', [
            'uses' => 'RecommendationController@show',
        ]);

        Route::put('{id}', [
            'uses' => 'RecommendationController@update',
        ]);

        Route::delete('{id}', [
            'uses' => 'RecommendationController@destroy',
        ]);
    });


});
