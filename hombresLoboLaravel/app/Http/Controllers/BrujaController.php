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

        // 2. AVISAR A TODOS (Feedback Visual)
        broadcast(new BrujaAccion($idPartida, $tipoAccion, $idObjetivo));

        // 3. COMPROBAR VICTORIA (Lógica de Servidor)
        $jugadoresVivos = $partida->jugadoresPartidaEstado()->wherePivot('estado', 1)->get();
        $totalVivos = $jugadoresVivos->count();
        // Contamos lobos (id_personaje = 2)
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
            // SI HAY GANADOR -> TERMINAR PARTIDA
            $partida->estado = 3; // Finalizada
            $partida->save();
            broadcast(new FinalizarPartida($idPartida, $ganador));
        } else {
            // SI EL JUEGO SIGUE -> CAMBIAR A DÍA AUTOMÁTICAMENTE

            // Pequeña pausa para que dé tiempo a leer el mensaje de la bruja en el frontend
            sleep(4);

            // Lógica de cambio de fase (copiada de MotorPartidaController)
            $partida->ronda = ($partida->ronda ?? 0) + 1; // No sumamos ronda aquí, o sí, según tu lógica (normalmente Día inicia ronda)
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