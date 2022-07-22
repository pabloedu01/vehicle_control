<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'middleware' => [ 'jwt.verify', 'user' ],
                 'prefix' => 'file-upload'
             ], function(){
    Route::post('{type}', [
        'uses'       => 'FileUploadController@store',
    ]);
});
