<?php

namespace App\Http\Controllers;

use App\Events\BrujaElimina;
use App\Events\BrujaRevivir;
use App\Events\CambiarFase;
use App\Events\CambiarTemporizador;
use App\Events\VerLobos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Partida;
use App\Models\Jugador;
use App\Models\JugadorPartidaPersonaje;

class MotorPartidaController extends Controller
{
    public function cambioFase(Request $request)
    {
        $id_partida = $request->input('id_partida');
        $fase = $request->input('fase');

        $duracionTurno = 1; //Duracion en minutos del turno

        $final = Carbon::now()->addMinutes($duracionTurno);
        event(new CambiarFase(
            $id_partida,
            $fase,
            $final->toIso8601String()
        ));

        return response()->json([
            'status' => 'ok',
            'fase' => $fase,
            'fin' => $final->toIso8601String()
        ]);
    }
    public function esHost(Request $request)
    {

        $request->validate(['id_partida' => 'required|integer']);

        $partidaId = $request->input('id_partida');
        $partida = Partida::findOrFail($partidaId);

        $user = $request->user();

        $miJugador = Jugador::where('id_usuario', $user->id)->first();

        $esHost = $partida->creador_id === $miJugador->id;

        return response()->json(['esHost' => $esHost]);
    }
    public function verLobos(Request $request, $idPartida)
    {
        $partida = Partida::findOrFail($idPartida);

        event(new VerLobos($idPartida));

        return response()->json([
            'mensaje' => 'ok',
        ]);
    }

    public function revivir(Request $request)
    {
        $idEliminado = $request->idEliminado;
        $idPartida   = $request->idPartida;

        $eliminado = Jugador::find($idEliminado);

        $partida = Partida::find($idPartida);
        $partida->jugadoresPartidaEstado()
            ->updateExistingPivot($idEliminado, ['estado' => 1]);

        $datos = JugadorPartidaPersonaje::query()
            ->where('id_jugador', $idEliminado)
            ->where('id_partida', $idPartida)
            ->select('id_jugador', 'id_partida', 'id_personaje', 'estado')
            ->first();

        event(new BrujaRevivir(
            $idPartida,
            $eliminado->nickname,
            $datos->id_personaje,
            $idEliminado
        ));

        return response()->json([
            'mensaje' => 'ok',
        ]);
    }

    public function eliminar(Request $request)
    {
        $idEliminado = $request->idEliminado;
        $idPartida   = $request->idPartida;

        $eliminado = Jugador::find($idEliminado);

        $partida = Partida::find($idPartida);
        $partida->jugadoresPartidaEstado()
            ->updateExistingPivot($idEliminado, ['estado' => 0]);

        $datos = JugadorPartidaPersonaje::query()
            ->where('id_jugador', $idEliminado)
            ->where('id_partida', $idPartida)
            ->select('id_jugador', 'id_partida', 'id_personaje', 'estado')
            ->first();

        event(new BrujaElimina(
            $idPartida,
            $eliminado->nickname,
            $datos->id_personaje,
            $idEliminado
        ));

        return response()->json([
            'mensaje' => 'ok',
        ]);
    }

    public function cambiarTemporizador(Request $request, $idPartida){
        event(new CambiarTemporizador($request->segundos, $idPartida));
    }
}
