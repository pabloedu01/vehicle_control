<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'quotations',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){



        Route::get('/', [
            'uses' => 'QuotationController@listAll',
        ]);
        Route::put('/', [
            'uses' => 'QuotationController@updateQuotation',
        ]);

        Route::post('/', [
            'uses' => 'QuotationController@storeQuotation',
        ]);


        Route::get('/show/{id}', [
            'uses' => 'QuotationController@showQuotation',
        ]);
        Route::delete('/{id}', [
            'uses' => 'QuotationController@destroy',
        ]);
        Route::post('/itens', [
            'uses' => 'QuotationController@storeQuotation',
        ]);
        Route::post('/itens/{id}', [
            'uses' => 'QuotationController@updateQuotationItens',
        ]);
        Route::get('/itens/{id}', [
            'uses' => 'QuotationController@showQuotationItens',
        ]);

        Route::delete('/itens/{id}', [
            'uses' => 'QuotationController@deleteItens',
        ]);

});
