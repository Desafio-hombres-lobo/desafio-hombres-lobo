<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JugadorPartidaPersonaje;
use App\Models\Jugador;
use App\Models\Partida;
use App\Models\Personaje;

class JugadorPartidaPersonajeController extends Controller
{

    public function obtenerDatosJugadorPartida(Request $request){
        $request->validate([
            'id_jugador' => 'required|integer',
            'id_partida' => 'required|integer',
        ]);

        $datos = JugadorPartidaPersonaje::query()
            ->where('id_jugador', $request->id_jugador)
            ->where('id_partida', $request->id_partida)
            ->select('id_jugador', 'id_partida', 'id_personaje', 'estado')
            ->first();

        if (!$datos) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado para este jugador y partida.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $datos
        ], 200);
    }

    public function asignarJugadorPartida(Request $request){
        $request->validate([
            'id_partida' => 'required|exists:partidas,id',
            'id_personaje' => 'required|exists:personajes,id',
        ]);

        $user = $request->user();
        $jugador = $user->jugador;

        if (!$jugador) {
            return response()->json(['error' => 'Perfil de jugador no encontrado'], 404);
        }

        $registroExistente = JugadorPartidaPersonaje::where('id_jugador', $jugador->id)
            ->where('id_partida', $request->id_partida)
            ->first();

        if ($registroExistente) {
            return response()->json(['error' => 'Jugador ya asignado a esta partida'], 409);
        }

        $registro = JugadorPartidaPersonaje::create([
            'id_jugador' => $jugador->id,
            'id_partida' => $request->id_partida,
            'id_personaje' => $request->id_personaje,
            'estado' => JugadorPartidaPersonaje::ESTADO_VIVO,
        ]);

        return response()->json(['mensaje' => 'Jugador asignado correctamente', 'datos' => $registro], 200);
    }

    public function cambiarEstadoPersonaje(Request $request){
        $request->validate([
            'id_jugador' => 'required|exists:jugadores,id',
            'id_partida' => 'required|exists:partidas,id',
            'estado' => 'required|in:0,1,2',
        ]);

        $registro = JugadorPartidaPersonaje::where('id_jugador', $request->id_jugador)
                    ->where('id_partida', $request->id_partida)
                    ->firstOrFail();

        // Si es un voto (estado = 2)
        if ($request->estado == 2) {
            $registro->votos += 1;
            $registro->save();

            return response()->json([
                'mensaje' => 'Voto registrado',
                'datos' => $registro
            ]);
        }

        // Si es matar o revivir directamente
        $registro->estado = $request->estado;
        $registro->save();

        return response()->json([
            'mensaje' => 'Estado actualizado',
            'datos' => $registro
        ]);
    }

    public function resolverVotos(Request $request){
        $request->validate([
            'id_partida' => 'required|exists:partidas,id',
        ]);

        // Buscar todos los jugadores de la partida
        $jugadores = JugadorPartidaPersonaje::where('id_partida', $request->id_partida)->get();

        // Jugador más votado
        $jugadorMasVotado = $jugadores->sortByDesc('votos')->first();

        if (!$jugadorMasVotado) {
            return response()->json(['mensaje' => 'No hay jugadores.'], 400);
        }

        // Matar al jugador más votado
        $jugadorMasVotado->estado = 0;
        $jugadorMasVotado->save();

        // Resetear votos
        JugadorPartidaPersonaje::where('id_partida', $request->id_partida)
            ->update(['votos' => 0]);

        return response()->json([
            'mensaje' => 'Jugador eliminado por votación.',
            'eliminado' => $jugadorMasVotado
        ]);
    }

    public function mostrarJugadoresPorEstado($id_partida, $estado)
    {
        $jugadores = JugadorPartidaPersonaje::where('id_partida', $id_partida)
                        ->where('estado', $estado)
                        ->with('jugador', 'personaje')
                        ->get();

        if ($jugadores->isEmpty()) {
            return response()->json(['mensaje' => 'No hay jugadores con este estado en la partida'], 200);
        }

        return response()->json($jugadores);
    }

}
