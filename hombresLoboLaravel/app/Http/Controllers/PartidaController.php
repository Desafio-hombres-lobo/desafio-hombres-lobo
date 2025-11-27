<?php

namespace App\Http\Controllers;

use App\Events\JugadorAbandono;
use App\Events\PlayerJoined;
use App\Events\IniciarPartida;
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
        $partidas = Partida::where('estado', 0)->get();
        return $partidas;
    }

    public function store(Request $request)
    {

        $request->validate([
            'nombre' => 'required|string|max:20',
            'num_jugadores' => 'required|integer|min:2|max:30',
        ]);

        $jugador = $request->user()->jugador;
        $partida=Partida::create([
            'creador_id' => $jugador->id,
            'nombre' => $request->nombre,
            'num_jugadores' => $request->num_jugadores,
            'estado' => 0,
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

        $Uniendo = false;

        if (!$partida->jugadoresLobby()->where('jugador_id', $jugador->id)->exists()) {
            $partida->jugadoresLobby()->attach($jugador->id);
            $Uniendo = true;
        }

        if ($Uniendo) {
            event(new PlayerJoined($player, $gameId));
        }

        return response()->json(['status' => 'ok']);
    }


    public function jugadores($id){
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }

        $jugadores = $partida->jugadoresLobby()->get(['nickname'])->pluck('nickname');

        return response()->json([
            'partida_id' => $id,
            'jugadores_actuales' => $jugadores->count(),
            'jugadores_maximos' => $partida->num_jugadores,
            'lista_jugadores' => $jugadores
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

    public function llenar(Request $request, $id)
{
    $partida = Partida::find($id);

    if (!$partida) {
        return response()->json(['error' => 'Partida no encontrada'], 404);
    }

    $request->validate([
        'estado' => 'required|integer|in:0,1,2,3', // 0=iniciando, 1=jugando, 2=llena, 3=finalizada
    ]);


    $partida->estado = $request->estado;
    $partida->save();

    return response()->json([
        'ok' => true,
        'mensaje' => "Estado actualizado a {$partida->estado}"
    ]);
}

    public function iniciarPartida($idPartida){
    broadcast(new IniciarPartida($idPartida));
    return response()->json(['ok' => true]);
    }

}


