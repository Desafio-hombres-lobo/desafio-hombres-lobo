<?php

namespace App\Http\Controllers;

use App\Events\CambiarFase;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Partida;
use App\Models\Jugador;

class MotorPartidaController extends Controller
{
    public function cambioFase(Request $request)
    {
        $partida_id = $request->input('partida_id');
        $fase = $request->input('fase');

        $duracionTurno = 0.2; //Duracion en minutos del turno

        $final = Carbon::now()->addMinutes($duracionTurno);
        event(new CambiarFase(
            $partida_id,
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

        $request->validate(['partida_id' => 'required|integer']);

        $partidaId = $request->input('partida_id');
        $partida = Partida::findOrFail($partidaId);

        $user = $request->user();

        $miJugador = Jugador::where('id_usuario', $user->id)->first();

        $esHost = $partida->creador_id === $miJugador->id;

        return response()->json(['esHost' => $esHost]);
    }
}
