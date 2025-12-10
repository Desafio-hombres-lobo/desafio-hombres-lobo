<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partida;
use App\Events\BrujaAccion;
use App\Events\CambiarFase;
use App\Events\FinalizarPartida;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class BrujaController extends Controller
{
    public function accion(Request $request, $idPartida)
    {
        $tipoAccion = $request->input('accion');
        $idObjetivo = $request->input('id_jugador_objetivo');

        $partida = Partida::findOrFail($idPartida);

        // 1. EJECUTAR ACCIÓN
        if ($tipoAccion === 'revivir' && $idObjetivo) {
            $partida->jugadoresPartidaEstado()->updateExistingPivot($idObjetivo, ['estado' => 1]);
        }
        if ($tipoAccion === 'matar' && $idObjetivo) {
            $partida->jugadoresPartidaEstado()->updateExistingPivot($idObjetivo, ['estado' => 0]);
        }

        broadcast(new BrujaAccion($idPartida, $tipoAccion, $idObjetivo));

        $jugadoresVivos = $partida->jugadoresPartidaEstado()->wherePivot('estado', 1)->get();
        $totalVivos = $jugadoresVivos->count();
        $lobosVivos = $jugadoresVivos->filter(function ($j) {
            return $j->pivot->id_personaje == 2;
        })->count();
        $aldeanosVivos = $totalVivos - $lobosVivos;

        $ganador = null;
        if ($lobosVivos == 0) {
            $ganador = 'aldeanos';
        } elseif ($lobosVivos >= $aldeanosVivos) {
            $ganador = 'lobos';
        }

        if ($ganador) {
            $partida->estado = 3;
            $partida->save();
            broadcast(new FinalizarPartida($idPartida, $ganador));
        } else {
            sleep(2);//para dar tiempo a los mensajes

            $partida->ronda = ($partida->ronda ?? 0) + 1;
            $partida->save();

            $duracionTurno = 1;
            $final = Carbon::now()->addMinutes($duracionTurno);

            broadcast(new CambiarFase(
                $idPartida,
                'dia', // Forzamos fase DÍA
                $final->toIso8601String(),
                $partida->ronda
            ));
        }

        return response()->json(['ok' => true]);
    }
}