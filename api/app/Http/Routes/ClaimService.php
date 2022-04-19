<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'claim-service',
                 'middleware' => [ 'jwt.verify', 'user' ],
             ], function(){
    
    Route::group([
                     'middleware' => [ 'user.company'],
                 ], function(){
    
    
    
    
        Route::get('/', [
            'uses' => 'ClaimServiceController@index',
        ]);
    
        Route::post('/', [
            'uses' => 'ClaimServiceController@store',
        ]);
        
        
    });
    
    Route::group([
                     'middleware' => [ 'company.claimService'],
                 ], function(){
    
        Route::get('{id}', [
            'uses' => 'ClaimServiceController@show',
        ]);
        
        Route::put('{id}', [
            'uses' => 'ClaimServiceController@update',
        ]);
    
        Route::delete('{id}', [
            'uses' => 'ClaimServiceController@destroy',
        ]);
    });
    
    
    
    
    
    
    
});