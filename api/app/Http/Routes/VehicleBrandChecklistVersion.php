<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'checklist-version',
                 'middleware' => [ 'jwt.verify', 'user' ],//middleware aplicado para todos los que estén dentro
             ], function(){


    Route::group([
                     'middleware' => [ 'vehicleBrand' ],
                 ], function(){


        #obtener listado
        Route::get('/', [
            'uses' => 'VehicleBrandChecklistVersionController@index',
        ]);

        #guardar
        Route::post('/', [
            'uses' => 'VehicleBrandChecklistVersionController@store',
        ]);
    });

    Route::group([
                     'middleware' => [ 'checklistVersion' ],
                 ], function(){

        #mostrar el detalle de uno en especifico
        Route::get('{id}', [
            'uses' => 'VehicleBrandChecklistVersionController@show',
        ]);

        #actualizar registro
        Route::put('{id}', [
            'uses' => 'VehicleBrandChecklistVersionController@update',
        ]);

        #eliminar
        Route::delete('{id}', [
            'uses' => 'VehicleBrandChecklistVersionController@destroy',
        ]);
    });
});
