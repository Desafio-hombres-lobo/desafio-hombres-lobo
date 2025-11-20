<?php

use App\Http\Controllers\UserController, App\Http\Controllers\AuthController, App\Http\Controllers\PartidaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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

Route::get('/partidas', [PartidaController::class, 'index']);
