<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'tire-brand',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){
    
    Route::group([
                     'middleware' => ['user.company'],
                 ], function(){
        
        Route::get('/', [
            'uses' => 'TireBrandController@index',
        ]);
    
        Route::post('/', [
            'uses' => 'TireBrandController@store',
        ]);
    });
    
    
    Route::group([
                     'middleware' => [ 'company.tireBrand'],
                 ], function(){
    
        Route::get('{id}', [
            'uses' => 'TireBrandController@show',
        ]);
    
        Route::put('{id}', [
            'uses' => 'TireBrandController@update',
        ]);
    
        Route::delete('{id}', [
            'uses' => 'TireBrandController@destroy',
        ]);
    });
    
    
});