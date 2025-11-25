<?php

namespace App\Http\Controllers;

use App\Events\CambiarFase;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MotorPartidaController extends Controller
{
    public function cambioFase(Request $request)
    {
        $partida_id = $request->input('partida_id');
        $fase = $request->input('fase');

        $duracionTurno = 1; //Duracion en minutos del turno

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
}
