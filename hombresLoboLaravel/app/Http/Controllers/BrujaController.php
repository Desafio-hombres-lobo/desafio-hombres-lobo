<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partida;
use App\Models\Jugador;
use Illuminate\Support\Facades\DB;
use App\Events\BrujaAccion; // Crearemos este evento unificado

class BrujaController extends Controller
{
    public function accion(Request $request, $idPartida)
    {
        $tipoAccion = $request->input('accion');
        $idObjetivo = $request->input('id_jugador_objetivo');

        $partida = Partida::findOrFail($idPartida);

        if ($tipoAccion === 'revivir' && $idObjetivo) {
            $partida->jugadoresPartidaEstado()->updateExistingPivot($idObjetivo, ['estado' => 1]);
            // Marcar poción gastada en DB si tienes esa columna (opcional por ahora)
        }

        if ($tipoAccion === 'matar' && $idObjetivo) {
            // Matar: Poner estado a 0
            $partida->jugadoresPartidaEstado()->updateExistingPivot($idObjetivo, ['estado' => 0]);
        }

        broadcast(new BrujaAccion($idPartida, $tipoAccion, $idObjetivo));

        return response()->json(['ok' => true]);
    }
}