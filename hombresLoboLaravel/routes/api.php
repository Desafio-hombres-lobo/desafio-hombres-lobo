<?php

use App\Http\Controllers\JugadorController;
use App\Http\Controllers\UserController, App\Http\Controllers\AuthController, App\Http\Controllers\PartidaController, App\Http\Controllers\CloudinaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Rutas de ADMIN (requieren token y la habilidad 'admin')
    Route::middleware('ability:admin')->group(function () {

        Route::apiResource('users', UserController::class);
        Route::get('/partidas', [PartidaController::class, 'index']);
    });

    //Rutas de usuario (requieren token y la habilidad 'usuario')
    Route::middleware('ability:usuario')->group(function () {

        # Cambiar nickname jugador
        Route::post('/cambiarNicknameUsuario', [JugadorController::class, 'update']);

        # Obtener Estadísticas Jugador
        Route::get('/obtenerEstadisticasJugador', [JugadorController::class, 'show']);

        # Cambiar Contraseña Jugador
        Route::post('/cambiarPasswordJugador', [JugadorController::class, 'cambiarPassword']);

        Route::get('/partidasIniciando', [PartidaController::class, 'partidasIniciando']);

        Route::post('/crearPartida', [PartidaController::class, 'store']);

        # Subir foto
        Route::post('/cambiarFoto', [CloudinaryController::class, 'cambiarFoto']);

        # Coger foto de perfil
        Route::get('/cargarFoto', [CloudinaryController::class, 'cargarFoto']);


        Route::get('/partida/{id}', [PartidaController::class, 'show']);

        Route::get('/jugador/{id}', [JugadorController::class, 'show']);
    });
});

//Rutas publicas
Route::post('/registrar', [AuthController::class, 'registrar']);
Route::post('/login', [AuthController::class, 'loguear']);
