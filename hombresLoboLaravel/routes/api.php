<?php

use App\Http\Controllers\ChatPartidaController;
use App\Http\Controllers\JugadorController;
use App\Http\Controllers\PersonajeController;
use App\Http\Controllers\JugadorPartidaPersonajeController;
use App\Http\Controllers\MotorPartidaController;
use App\Http\Controllers\UserController, App\Http\Controllers\AuthController, App\Http\Controllers\PartidaController, App\Http\Controllers\CloudinaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\VotoController;

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

        # Rutas Acciones Personajes
        Route::get('/personajes', [PersonajeController::class, 'index']);
        Route::post('/accionPersonaje', [PersonajeController::class, 'accionesDelPersonaje']);
        Route::post('/datosJugadorPartida', [JugadorPartidaPersonajeController::class, 'obtenerDatosJugadorPartida']);
        Route::post('/asignarJugadorAPartida', [JugadorPartidaPersonajeController::class, 'asignarJugadorPartida']);
        Route::put('/cambiarEstadoDePersonaje', [JugadorPartidaPersonajeController::class, 'cambiarEstadoPersonaje']);
        Route::post('/resolverVotos', [JugadorPartidaPersonajeController::class, 'resolverVotos']);
        Route::post('/chat/aldea', [ChatPartidaController::class, 'enviar']);
        Route::post('/chat/lobos', [ChatPartidaController::class, 'enviarLobos']);
        Route::post('/partida/cambiarFase', [MotorPartidaController::class, 'cambioFase']);
        Route::post('/partida/host', [MotorPartidaController::class, 'esHost']);
        Route::get('/jugador/{id}', [JugadorController::class, 'showJugador']);
        Route::get('/partidas/{id_partida}/lobos', [JugadorPartidaPersonajeController::class, 'obtenerLobos']);
        Route::get('/partidas/{id_partida}/idLobos', [JugadorPartidaPersonajeController::class, 'obtenerIdLobos']);


        Route::post('/game/join', [PartidaController::class, 'join']);

        Route::get('/creadorPartida/{id}', [PartidaController::class, 'creadorPartida']);

        Route::get('/jugador', [JugadorController::class, 'jugadorActual']);

        Route::get('/partida/{id}/jugadores', [PartidaController::class, 'jugadores']);

        Route::post('/partida/abandonar', [PartidaController::class, 'abandonarPartida']);


        Route::post('/chat/send', [ChatController::class, 'send']);
        Route::post('/chat/send/{bot}', [ChatController::class, 'sendMensajeBot']);
        Route::post('/chat/send/{bot}/lobo', [ChatController::class, 'sendMensajeBotLobo']);

        Route::post('/{id}/llena', [PartidaController::class, 'llenar']);

        Route::post('/rellenar/partida/{idPartida}', [PartidaController::class, 'rellenarBots']);

        Route::post('/{partidaId}/iniciar', [PartidaController::class, 'iniciarPartida']);
        Route::post('/{partidaId}/empezar', [PartidaController::class, 'empezarPartida']);
        Route::post('/partida/miRol', [PartidaController::class, 'obtenerMiRol']);

        //Registrar voto de un usuario
        Route::post('/partidas/{idPartida}/votar', [VotoController::class, 'votar']);

        //Obtener los votos de la ronda ¿Es necesario?
        Route::get('/partidas/{idPartida}/votos/{ronda}', [VotoController::class, 'obtenerVotos']);

        //Obtener resultado de la votación de la ronda
        Route::post('/partidas/{idPartida}/resultado/{ronda}', [VotoController::class, 'resultadoVotacion']);

        //Finalizar votación cuando se acabe el tiempo
        Route::post('/partida/{id}/finalizar-votacion/{ronda}', [VotoController::class, 'finalizarVotacion']);

        Route::post('/partida/{idPartida}/votarBot/{bot}/{ronda}', [VotoController::class, 'calcularVoto']);

        Route::get('/partida/{idPartida}/calcularVoto/{idBot}/{ronda}', [VotoController::class, 'calcularVoto']);

        Route::get('/partida/{idPartida}/calcularVotoNoche/{idBot}/{ronda}', [VotoController::class, 'calcularVotoLobo']);

        Route::post('/partida/{idBot}/votar/{ronda}', [VotoController::class, 'votarBot']);
        Route::put('/partida/{idPartida}/eliminar-jugador/{idJugador}', [PartidaController::class, 'eliminarJugador']);

        Route::get('/datosJugadoresPartida/{idPartida}', [JugadorPartidaPersonajeController::class, 'obtenerJugadoresPartida']);

        //Ganar o perder partida
        Route::post('/partida/{idPartida}/ganar', [PartidaController::class, 'ganarPartida']);
        Route::post('/partida/{idPartida}/perder', [PartidaController::class, 'perderPartida']);

        Route::post('/partida/{idPartida}/finalizar-partida', [PartidaController::class, 'finalizarPartida']);

        //Habilidades personaje
        Route::post('/partidas/{idPartida}/ninia', [MotorPartidaController::class, 'verLobos']);

    });
});

//Rutas publicas
Route::post('/registrar', [AuthController::class, 'registrar']);
Route::post('/login', [AuthController::class, 'loguear']);

