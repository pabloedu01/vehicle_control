<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'product',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){
    
    Route::group([
                     'middleware' => [ 'user.company'],
                 ], function(){
    
    
    
    
        Route::get('/', [
            'uses' => 'ProductController@index',
        ]);
    
        Route::post('/', [
            'uses' => 'ProductController@store',
        ]);
        
        
    });
    
    Route::group([
                     'middleware' => [ 'company.product'],
                 ], function(){
    
        Route::get('{id}', [
            'uses' => 'ProductController@show',
        ]);
        
        Route::put('{id}', [
            'uses' => 'ProductController@update',
        ]);
    
        Route::delete('{id}', [
            'uses' => 'ProductController@destroy',
        ]);
    });
    
    
    
    
    
    
    
});