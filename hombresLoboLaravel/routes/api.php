<?php

use App\Http\Controllers\UserController, App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Rutas de ADMIN (requieren token Y la habilidad 'admin')
    Route::apiResource('users', UserController::class)
        ->middleware('ability:admin');

});

//Rutas publicas
Route::post('/registrar', [AuthController::class, 'registrar']);
Route::post('/login', [AuthController::class, 'loguear']);