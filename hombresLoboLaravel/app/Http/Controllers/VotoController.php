<?php

namespace App\Http\Controllers;

use App\Events\VotacionTerminada;
use App\Events\Votar;
use App\Models\Jugador;
use App\Models\Partida;
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

        $partida = Partida::find($idPartida);
        $jugadoresVivos = $partida->jugadoresLobby()->wherePivot('eliminado', false)->count();
        $votosRonda = Voto::where('id_partida', $idPartida)
                            ->where('ronda', $validated['ronda'])
                            ->get();

        if ($votosRonda->count() >= $jugadoresVivos) {
            $conteoVotos = $votosRonda->groupBy('id_jugador_votado')
                                    ->map(fn($votos) => count($votos));

            $maxVotos = $conteoVotos->max();

            $jugadoresConMax = $conteoVotos->filter(fn($v) => $v === $maxVotos)->keys();

            if ($jugadoresConMax->count() === 1) {
                $idEliminado = $jugadoresConMax->first();
                $eliminado = Jugador::find($idEliminado)->nickname;
                $resultado = "eliminado";

                $partida->jugadoresLobby()->updateExistingPivot($idEliminado, ['eliminado' => true]);
            } else {
                $eliminado = null;
                $resultado = "empate";
            }

            broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado));
        }

        return response()->json([
            'ok' => true,
            'voto' => $voto,
        ]);
    }

    public function finalizarVotacion($idPartida, $ronda)
    {
        $partida = Partida::find($idPartida);
        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }

        $votosRonda = Voto::where('id_partida', $idPartida)
                            ->where('ronda', $ronda)
                            ->get();

        $jugadoresVivos = $partida->jugadoresLobby()->wherePivot('eliminado', false)->get();

        if ($votosRonda->isEmpty()) {
            $resultado = "empate";
            $eliminado = null;
        } else {
            $conteoVotos = $votosRonda->groupBy('id_jugador_votado')
                                    ->map(fn($v) => count($v));
            $maxVotos = $conteoVotos->max();
            $jugadoresConMax = $conteoVotos->filter(fn($v) => $v === $maxVotos)->keys();

            if ($jugadoresConMax->count() === 1) {
                $idEliminado = $jugadoresConMax->first();
                $eliminado = Jugador::find($idEliminado)->nickname;
                $resultado = "eliminado";

                $partida->jugadoresLobby()->updateExistingPivot($idEliminado, ['eliminado' => true]);
            } else {
                $resultado = "empate";
                $eliminado = null;
            }
        }

        broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado));

        return response()->json([
            'ok' => true,
            'resultado' => $resultado,
            'eliminado' => $eliminado,
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
        $votos = Voto::votosPartida($idPartida);

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
        $jugadorEliminado = Jugador::find($idJugadorEliminado);

        DB::table('jugador_partida')
            ->where('id_partida', $idPartida)
            ->where('id_jugador', $idJugadorEliminado)
            ->update([
                'eliminado' => true
            ]);

            event(new VotacionTerminada(
                $idPartida,
                'eliminado',
                $jugadorEliminado->nickname
            ));


        return response()->json([
            'resultado' => 'eliminado',
            'jugador_eliminado' => $jugadorEliminado->nickname
        ]);
    }

       public function calcularVoto($idPartida, $idBot, $ronda)
    {
        $bot = Jugador::findOrFail($idBot);

        $idVotado = $bot->calcularVoto($idPartida, $bot);

        // Registrar el voto del bot
        if ($idVotado) {
            Voto::create([
                'id_partida' => $idPartida,
                'id_jugador' => $bot->id,
                'id_jugador_votado' => $idVotado,
                'ronda' => $ronda,
            ]);
        }

        return response()->json(['voto_bot' => $idVotado]);
    }


}
