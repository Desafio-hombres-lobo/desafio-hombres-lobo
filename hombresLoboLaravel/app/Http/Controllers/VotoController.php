<?php

namespace App\Http\Controllers;

use App\Models\Voto;
use Illuminate\Http\Request;

class VotoController extends Controller
{
    public function votar(Request $request, $idPartida)
    {
        $validated = $request->validate([
            'id_jugador' => 'required|exists:jugadores,id',
            'id_jugador_votado' => 'required|exists:jugadores,id',
            'ronda' => 'required|integer|min=1',
        ]);

            $voto = Voto::create([
                'id_partida' => $idPartida,
                'id_jugador' => $validated['id_jugador'],
                'id_jugador_votado' => $validated['id_jugador_votado'],
                'ronda' => $validated['ronda'],
            ]);

            return response()->json([
                'ok' => true,
                'voto' => $voto,
            ]);
    }


    public function obtenerVotos($idPartida, $ronda)
    {
        $votos = Voto::where('id_partida', $idPartida)
            ->where('ronda', $ronda)
            ->get();

        return response()->json([
            'ok' => true,
            'votos' => $votos,
        ]);
    }

}
