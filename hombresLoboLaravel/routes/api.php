<?php

use App\Http\Controllers\JugadorController;
use App\Http\Controllers\UserController, App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);

Route::post('/registrar', [AuthController::class, 'registrar']);
Route::post('/login', [AuthController::class, 'loguear']);

# Cambiar nickname jugador
Route::post('/cambiarNicknameUsuario', [JugadorController::class, 'update'])
     ->middleware('auth:sanctum');

# Obtener Estadísticas Jugador
Route::get('/obtenerEstadisticasJugador', [JugadorController::class, 'show'])
     ->middleware('auth:sanctum');

