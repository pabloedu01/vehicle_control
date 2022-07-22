<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'middleware' => [ 'jwt.verify', 'user', 'company' ],
                 'prefix' => 'import'
             ], function(){
    Route::post('/', [
        'uses'       => 'ImportController@store',
    ]);
});
