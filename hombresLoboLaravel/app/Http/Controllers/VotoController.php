<?php

namespace App\Http\Controllers;

use App\Events\VotacionTerminada;
use App\Events\Votar;
use App\Models\Jugador;
use App\Models\Partida;
use App\Models\Voto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\VotoLobo;

class VotoController extends Controller
{
    public function votar(Request $request, $idPartida)
    {
        $dia = $request->dia;
        $idPersonaje = $request->idPersonaje;
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
        $jugadorVotado = Jugador::find($validated['id_jugador_votado']);
        $partida = Partida::find($idPartida);
        if ($dia) {
            event(new Votar(
                $idPartida,
                $jugador->nickname,
                $jugadorVotado->nickname
            ));
            $jugadoresVivos = $partida->jugadoresPartidaEstado()->wherePivot('estado', 1)->count();
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

                    $idPersonaje = DB::table('jugador_partida_personajes')
                        ->where('id_partida', $idPartida)
                        ->where('id_jugador', $idEliminado)
                        ->value('id_personaje');

                    $partida->jugadoresPartidaEstado()->updateExistingPivot($idEliminado, ['estado' => 0]);
                } else {
                    $eliminado = null;
                    $resultado = "empate";
                    $idPersonaje = null;
                    $idEliminado = null;
                }

                broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado, $idPersonaje, $idEliminado));
            }
        } else if (!$dia && $idPersonaje == 2) {
            broadcast(new VotoLobo(
                $idPartida,
                $jugador->nickname,
                $jugadorVotado->nickname
            ));

            $lobosVivos = $partida->jugadoresPartidaEstado()->wherePivot('estado', 1)->wherePivot('id_personaje', 2)->count();
            $votosRonda = Voto::where('id_partida', $idPartida)
                ->where('ronda', $validated['ronda'])
                ->get();
            if ($votosRonda->count() >= $lobosVivos) {
                $conteoVotos = $votosRonda->groupBy('id_jugador_votado')
                    ->map(fn($votos) => count($votos));

                $maxVotos = $conteoVotos->max();

                $jugadoresConMax = $conteoVotos->filter(fn($v) => $v === $maxVotos)->keys();

                if ($jugadoresConMax->count() === 1) {
                    $idEliminado = $jugadoresConMax->first();
                    $eliminado = Jugador::find($idEliminado)->nickname;
                    $resultado = "eliminado";

                    $idPersonaje = DB::table('jugador_partida_personajes')
                        ->where('id_partida', $idPartida)
                        ->where('id_jugador', $idEliminado)
                        ->value('id_personaje');

                    $partida->jugadoresPartidaEstado()->updateExistingPivot($idEliminado, ['estado' => 0]);
                } else {
                    $eliminado = null;
                    $resultado = "empate";
                    $idPersonaje = null;
                    $idEliminado = null;
                }

                broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado, $idPersonaje, $idEliminado));
            }
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

        $jugadoresVivos = $partida->jugadoresPartidaEstado()->wherePivot('estado', 0)->get();

        if ($votosRonda->isEmpty()) {
            $resultado = "empate";
            $eliminado = null;
            $idPersonaje = null;
            $idEliminado = null;
        } else {
            $conteoVotos = $votosRonda->groupBy('id_jugador_votado')
                ->map(fn($v) => count($v));
            $maxVotos = $conteoVotos->max();
            $jugadoresConMax = $conteoVotos->filter(fn($v) => $v === $maxVotos)->keys();

            if ($jugadoresConMax->count() === 1) {
                $idEliminado = $jugadoresConMax->first();
                $idPersonaje = DB::table('jugador_partida_personajes')
                    ->where('id_partida', $idPartida)
                    ->where('id_jugador', $idEliminado)
                    ->value('id_personaje');
                $eliminado = Jugador::find($idEliminado)->nickname;
                $resultado = "eliminado";

                $partida->jugadoresPartidaEstado()->updateExistingPivot($idEliminado, ['estado' => 0]);
            } else {
                $resultado = "empate";
                $eliminado = null;
                $idPersonaje = null;
                $idEliminado = null;
            }
        }

        broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado, $idPersonaje, $idEliminado));

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
                null,
                null,
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
            event(new VotacionTerminada(
                $idPartida,
                'empate',
                null,
                null,
                null
            ));
            return response()->json([
                'resultado' => 'empate',
                'jugador_eliminado' => null,
                'id_personaje_eliminado' => null
            ]);
        }

        $idJugadorEliminado = $masVotados->keys()->first();
        $jugadorEliminado = Jugador::find($idJugadorEliminado);
        $idPersonaje = DB::table('jugador_partida_personajes')
            ->where('id_partida', $idPartida)
            ->where('id_jugador', $idJugadorEliminado)
            ->value('id_personaje');
        DB::table('jugador_partida')
            ->where('id_partida', $idPartida)
            ->where('id_jugador', $idJugadorEliminado)
            ->update([
                'eliminado' => true
            ]);

        event(new VotacionTerminada(
            $idPartida,
            'eliminado',
            $jugadorEliminado->nickname,
            $idPersonaje,
            $idJugadorEliminado
        ));


        return response()->json([
            'resultado' => 'eliminado',
            'jugador_eliminado' => $jugadorEliminado->nickname,
            'id_personaje_eliminado' => $idPersonaje
        ]);
    }

    public function calcularVoto($idPartida, $idBot, $ronda)
    {
        $bot = Jugador::findOrFail($idBot);

        $idVotado = $bot->calcularVoto($idPartida, $bot);
        $jugadorVotado = Jugador::findOrFail($idVotado);

        return response()->json([
            'voto_bot' => $idVotado,
            'nickname_votado' => $jugadorVotado->nickname,
            'id_bot' => $bot->id,
            'nickname_bot' => $bot->nickname
        ]);
    }


    public function calcularVotoLobo($idPartida, $idBot, $ronda)
    {
        $bot = Jugador::findOrFail($idBot);

        $idVotado = $bot->calcularVotoNoche($idPartida, $bot);
        $jugadorVotado = Jugador::findOrFail($idVotado);

        return response()->json([
            'voto_bot' => $idVotado,
            'nickname_votado' => $jugadorVotado->nickname,
            'id_bot' => $bot->id,
            'nickname_bot' => $bot->nickname
        ]);
    }


    public function votarBot(Request $request, $idPartida, $ronda)
    {
        $idVotado = $request->voto_bot;
        $idBot = $request->id_bot;
        $dia = $request->dia;//boolean para saber si es de día o de noche
        if ($idVotado) {
            Voto::create([
                'id_partida' => $idPartida,
                'id_jugador' => $idBot,
                'id_jugador_votado' => $idVotado,
                'ronda' => $ronda,
            ]);
        }

        $jugadorVotado = Jugador::find($idVotado);
        $bot = Jugador::find($idBot);
        if ($dia) {
            event(new Votar(
                $idPartida,
                $bot->nickname,
                $jugadorVotado->nickname
            ));
        } else {
            event(new VotoLobo(
                $idPartida,
                $bot->nickname,
                $jugadorVotado->nickname
            ));

        }


        if (!$dia) {
            $partida = Partida::find($idPartida);
            $votosLobo = DB::table('jugador_partida_personajes')
                ->where('id_partida', $idPartida)
                ->where('id_personaje', 2)
                ->where('estado', 1)
                ->count();
            $votosRonda = Voto::where('id_partida', $idPartida)
                ->where('ronda', $ronda)
                ->get();

            if ($votosRonda->count() >= $votosLobo) {
                $conteoVotos = $votosRonda->groupBy('id_jugador_votado')
                    ->map(fn($votos) => count($votos));

                $maxVotos = $conteoVotos->max();

                $jugadoresConMax = $conteoVotos->filter(fn($v) => $v === $maxVotos)->keys();

                if ($jugadoresConMax->count() === 1) {
                    $idEliminado = $jugadoresConMax->first();
                    $eliminado = Jugador::find($idEliminado)->nickname;
                    $resultado = "eliminado";

                    $idPersonaje = DB::table('jugador_partida_personajes')
                        ->where('id_partida', $idPartida)
                        ->where('id_jugador', $idEliminado)
                        ->value('id_personaje');

                    $partida->jugadoresPartidaEstado()->updateExistingPivot($idEliminado, ['estado' => 0]);
                } else {
                    $eliminado = null;
                    $resultado = "empate";
                    $idPersonaje = null;
                    $idEliminado = null;
                }

                broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado, $idPersonaje, $idEliminado));
            }
        } else {
            $partida = Partida::find($idPartida);
            $jugadoresVivos = $partida->jugadoresPartidaEstado()->wherePivot('estado', 1)->count();
            $votosRonda = Voto::where('id_partida', $idPartida)
                ->where('ronda', $ronda)
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

                    $idPersonaje = DB::table('jugador_partida_personajes')
                        ->where('id_partida', $idPartida)
                        ->where('id_jugador', $idEliminado)
                        ->value('id_personaje');

                    $partida->jugadoresPartidaEstado()->updateExistingPivot($idEliminado, ['estado' => 0]);
                } else {
                    $eliminado = null;
                    $resultado = "empate";
                    $idPersonaje = null;
                    $idEliminado = null;
                }

                broadcast(new VotacionTerminada($idPartida, $resultado, $eliminado, $idPersonaje, $idEliminado));
            }
        }


        return response()->json(['votado' => 'ok']);
    }

}
