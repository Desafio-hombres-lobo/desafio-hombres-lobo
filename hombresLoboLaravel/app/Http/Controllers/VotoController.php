<?php

namespace App\Http\Controllers;

use App\Events\VotacionTerminada;
use App\Events\Votar;
use App\Models\Jugador;
use App\Models\Voto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VotoController extends Controller
{
    public function votar(Request $request, $idPartida)
    {
        $validated = $request->validate([
            'id_jugador' => 'required|exists:jugadores,id',
            'id_jugador_votado' => 'required|exists:jugadores,id',
            'ronda' => 'required|integer|min:1',
        ]);

        $voto = Voto::create([
            'id_partida' => $idPartida,
            'id_jugador' => $validated['id_jugador'],
            'id_jugador_votado' => $validated['id_jugador_votado'],
            'ronda' => $validated['ronda'],
        ]);

        $jugador = Jugador::find($validated['id_jugador']);
        $jugadoVotado = Jugador::find($validated['id_jugador_votado']);

        event(new Votar(
            $idPartida,
            $jugador->nickname,
            $jugadoVotado->nickname
        ));

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

        public function resultadoVotacion($idPartida, $ronda)
    {
        $votos = Voto::where('id_partida', $idPartida)
            ->where('ronda', $ronda)
            ->get();

        if ($votos->isEmpty()) {
            event(new VotacionTerminada(
            $idPartida,
            'empate',
             null
            ));
            return response()->json([
                'resultado' => 'empate',
                'jugador_eliminado' => null
            ]);
        }

        $conteo = $votos->groupBy('id_jugador_votado')->map->count();

        $maxVotos = $conteo->max();

        $masVotados = $conteo->filter(function ($count) use ($maxVotos) {
            return $count === $maxVotos;
        });

        // Si hay empate ¿?
        if ($masVotados->count() > 1) {
            return response()->json([
                'resultado' => 'empate',
                'jugador_eliminado' => null
            ]);
        }

        $idJugadorEliminado = $masVotados->keys()->first();

        DB::table('jugador_partida')
            ->where('id_partida', $idPartida)
            ->where('id_jugador', $idJugadorEliminado)
            ->update([
                'estado' => 'eliminado'
            ]);

        return response()->json([
            'resultado' => 'eliminado',
            'jugador_eliminado' => $idJugadorEliminado
        ]);
    }


}
