<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/toyota', function () {

    $pdf = \PDF::loadView('reports.vehicle-service.toyota');
    return $pdf->download('archivo-pdf.pdf');
});

Route::get('/toyota-view', function () {

    return view('reports.vehicle-service.toyota');
});
