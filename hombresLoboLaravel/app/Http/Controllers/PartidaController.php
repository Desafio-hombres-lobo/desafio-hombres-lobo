<?php

namespace App\Http\Controllers;

use App\Events\JugadorAbandono;
use App\Events\PlayerJoined;
use App\Models\Jugador;
use App\Models\Partida;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartidaController extends Controller

{
    public function index()
    {
    $partidas = Partida::all();
    return response()->json($partidas);
    }


    public function partidasIniciando(){
        $partidas = Partida::where('estado', 'iniciando')->get();
        return $partidas;
    }

    public function store(Request $request)
    {

        $request->validate([
            'nombre' => 'required|string|max:20',
            'num_jugadores' => 'required|integer|min:15|max:30',
        ]);

        $jugador = $request->user()->jugador;
        $partida=Partida::create([
            'creador_id' => $jugador->id,
            'nombre' => $request->nombre,
            'num_jugadores' => $request->num_jugadores,
            'estado' => 'iniciando',
            'codigo' => Str::upper(Str::random(6)),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Partida creada correctamente.',
            'partida' => [
                'id' => $partida->id,
                'codigo' => $partida->codigo,
                'num_jugadores' => $partida->num_jugadores
            ]
        ]);

    }

    public function show($id)
    {
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['message' => 'Partida no encontrada'], 404);
        }

        return response()->json($partida);
    }

    public function join(Request $request)
    {
        $gameId = $request->input('game_id');
        $player = $request->input('player');

        $user = $request->user();

        $jugador = Jugador::where('id_usuario', $user->id)->firstOrFail();


        $partida = Partida::findOrFail($gameId);

        if (!$partida->jugadoresLobby()->where('jugador_id', $jugador->id)->exists()) {
            $partida->jugadoresLobby()->attach($jugador->id);
        }


        event(new PlayerJoined($player, $gameId));

        return response()->json(['status' => 'ok']);
    }

    public function jugadores($id){
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }


        $jugadores = $partida->jugadoresLobby()->count();

        return response()->json([
            'partida_id' => $id,
            'jugadores_actuales' => $jugadores,
            'jugadores_maximos' => $partida->num_jugadores
        ]);
    }

    public function creadorPartida($idPartida){
        $partida = Partida::find($idPartida);

        if(!$partida){
            return response()->json(['error' => 'Partida no encontrada']);
        }

        return $partida->creador_id;
    }

    public function abandonarPartida(Request $request)
    {
        $validated = $request->validate([
            'partida_id' => 'required|exists:partidas,id',
        ]);

        $partidaId = $validated['partida_id'];


        $usuarioId = $request->user()->id;

        $jugador = Jugador::where('id_usuario', $usuarioId)->first();

        if (!$jugador) {
            return response()->json(['error' => 'Jugador no encontrado'], 404);
        }

        $partida = Partida::find($partidaId);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }

        if ($partida->jugadoresLobby()->where('jugador_id', $jugador->id)->exists()) {

            $partida->jugadoresLobby()->detach($jugador->id);

            broadcast(new JugadorAbandono($partidaId, $jugador->nickname))->toOthers();

            return response()->json([
                'mensaje' => 'Has abandonado la partida correctamente',
                'jugadores_actuales' => $partida->jugadoresLobby()->count()
            ]);
        }

        return response()->json(['error' => 'No estás en esta partida¿?'], 400);
    }
}


