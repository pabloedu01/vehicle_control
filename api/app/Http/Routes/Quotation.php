<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'prefix'     => 'quotations',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){

                Route::group([
                    'middleware' => [ 'company' ],
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
    });

    Route::get('/show/{id}', [
        'uses' => 'QuotationController@showQuotation',
    ]);
    Route::delete('/{id}', [
        'uses' => 'QuotationController@destroy',
    ]);
    

});
