<?php

namespace App\Http\Controllers;

use App\Events\CambiarFase;
use App\Events\VerLobos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Partida;
use App\Models\Jugador;

class MotorPartidaController extends Controller
{
    public function cambioFase(Request $request)
    {
        $id_partida = $request->input('id_partida');
        $fase = $request->input('fase');
        $partida = Partida::findOrFail($id_partida);
        $partida->ronda = ($partida->ronda ?? 0) + 1;
        $partida->save();

        $duracionTurno = 1; //Duracion en minutos del turno

        $final = Carbon::now()->addMinutes($duracionTurno);
        event(new CambiarFase(
            $id_partida,
            $fase,
            $final->toIso8601String(),
            $partida->ronda,
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
}
