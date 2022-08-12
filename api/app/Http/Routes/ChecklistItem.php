<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'checklist-item',
                 'middleware' => [ 'jwt.verify', 'user' ],//middleware aplicado para todos los que estén dentro
             ], function(){


    #obtener listado
    Route::get('/', [
        'uses' => 'ChecklistItemController@index',
    ]);

    #obtener listado activo
    Route::get('active-checklist-items', [
        'uses' => 'ChecklistItemController@activeItems',
    ]);

    #guardar
    Route::post('/', [
        'uses' => 'ChecklistItemController@store',
    ]);

    #mostrar el detalle de uno en especifico
    Route::get('{id}', [
        'uses' => 'ChecklistItemController@show',
    ]);

    #actualizar registro
    Route::put('{id}', [
        'uses' => 'ChecklistItemController@update',
    ]);

    #eliminar
    Route::delete('{id}', [
        'uses' => 'ChecklistItemController@destroy',
    ]);
});
