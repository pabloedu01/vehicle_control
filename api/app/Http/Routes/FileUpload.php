<?php

use Illuminate\Support\Facades\Route;

Route::group([
                 'middleware' => [ 'jwt.verify', 'user' ],
                 'prefix' => 'file-upload'
             ], function(){
    Route::post('image', [
        'uses'       => 'FileUploadController@storeImage',
    ]);
});
