<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'estimates',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){



        Route::get('/', [
            'uses' => 'EstimatesController@showEstimateItens',
        ]);

        Route::post('/', [
            'uses' => 'EstimatesController@store',
        ]);


        Route::get('/show/{id}', [
            'uses' => 'EstimatesController@showEstimate',
        ]);
        Route::delete('/{id}', [
            'uses' => 'EstimatesController@destroy',
        ]);
        Route::post('/itens', [
            'uses' => 'EstimatesController@storeEstimate',
        ]);
        Route::post('/itens/{id}', [
            'uses' => 'EstimatesController@updateEstimateItens',
        ]);
        Route::get('/itens/{id}', [
            'uses' => 'EstimatesController@showEstimateItens',
        ]);

        Route::delete('/itens/{id}', [
            'uses' => 'EstimatesController@deleteItens',
        ]);

});
