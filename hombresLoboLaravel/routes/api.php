<?php

use App\Http\Controllers\JugadorController;
use App\Http\Controllers\UserController, App\Http\Controllers\AuthController, App\Http\Controllers\PartidaController;
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
    //  ->middleware(['auth:sanctum', 'ability:usuario']);

# Cambiar Contraseña Jugador
Route::post('/cambiarPasswordJugador', [JugadorController::class, 'cambiarPassword'])
     ->middleware('auth:sanctum');

Route::get('/partidas', [PartidaController::class, 'index']);

Route::get('/partidasIniciando', [PartidaController::class, 'partidasIniciando']);

Route::post('/crearPartida', [PartidaController::class, 'store'])
     ->middleware('auth:sanctum');

