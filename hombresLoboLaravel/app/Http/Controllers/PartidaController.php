<?php

namespace App\Http\Controllers;

use App\Events\EmpezarPartida;
use App\Events\JugadorAbandono;
use App\Events\PlayerJoined;
use App\Events\IniciarPartida;
use App\Events\FinalizarPartida;
use App\Models\Jugador;
use App\Models\Partida;
use App\Models\JugadorPartidaPersonaje;
use App\Models\Voto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PartidaController extends Controller
{
    public function index()
    {
        $partidas = Partida::all();
        return response()->json($partidas);
    }


    public function partidasIniciando()
    {
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
        $partida = Partida::create([
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

        if (!$partida->jugadoresLobby()->where('id_jugador', $jugador->id)->exists()) {
            $partida->jugadoresLobby()->attach($jugador->id);
            $Uniendo = true;
        }

        if ($Uniendo) {
            event(new PlayerJoined($player, $gameId));
        }

        return response()->json(['status' => 'ok']);
    }


    public function jugadores($id)
    {
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }

        $jugadores = $partida->jugadoresLobby()
            ->select('jugadores.id', 'jugadores.nickname', 'jugadores.bot')
            ->where('eliminado', false)
            ->get();

        return response()->json([
            'id_partida' => $id,
            'jugadores_actuales' => $jugadores->count(),
            'jugadores_maximos' => $partida->num_jugadores,
            'lista_jugadores' => $jugadores
        ]);
    }

    public function creadorPartida($idPartida)
    {
        $partida = Partida::find($idPartida);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada']);
        }

        return $partida->creador_id;
    }

    public function abandonarPartida(Request $request)
    {
        $validated = $request->validate([
            'id_partida' => 'required|exists:partidas,id',
        ]);

        $partidaId = $validated['id_partida'];


        $usuarioId = $request->user()->id;

        $jugador = Jugador::where('id_usuario', $usuarioId)->first();

        if (!$jugador) {
            return response()->json(['error' => 'Jugador no encontrado'], 404);
        }

        $partida = Partida::find($partidaId);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }

        if ($partida->jugadoresLobby()->where('id_jugador', $jugador->id)->exists()) {

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

    public function iniciarPartida($idPartida)
    {
        // broadcast(new IniciarPartida($idPartida));
        // return response()->json(['ok' => true]);
        $partida = Partida::find($idPartida);

        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada', 400]);
        }

        // Obtener jugadores de la lobby
        $jugadores = $partida->jugadoresLobby()->get();
        $totalJugadores = $jugadores->count();

        $numLobos = floor($totalJugadores * 0.3);



        // Mínimo un lobo siempre
        if ($numLobos < 1) {
            $numLobos = 1;
        }
        $rolesEspeciales = [];

        $rolesEspeciales[] = 3;
        $rolesEspeciales[] = 4;
        // Crear mazo con ID´s
        $mazo = [];
        for ($i = 0; $i < $numLobos; $i++) {
            $mazo[] = 2;
        }

        foreach ($rolesEspeciales as $rolId) {
            if (count($mazo) < $totalJugadores) {
                $mazo[] = $rolId;
            }
        }
        while (count($mazo) < $totalJugadores) {
            $mazo[] = 1;
        }


        shuffle($mazo);

        // Guardar en la BD (ayuda IA)
        DB::beginTransaction();
        try {
            foreach ($jugadores as $index => $jugador) {
                // updateOrCreate para evitar duplicados si se le da dos veces
                JugadorPartidaPersonaje::updateOrCreate(
                    [
                        'id_partida' => $partida->id,
                        'id_jugador' => $jugador->id
                    ],
                    [
                        'id_personaje' => $mazo[$index],
                        'estado' => 1, // 1 = Vivo
                        'votos' => 0
                    ]
                );
            }

            // Cambiar estado partida a "Iniciada"
            $partida->estado = 1;
            $partida->save();

            DB::commit();

            // Avisar a todos
            broadcast(new IniciarPartida($idPartida));

            return response()->json(['ok' => true, 'mensaje' => 'Roles repartidos y partida iniciada']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error repartiendo roles: ' . $e->getMessage()], 500);
        }

    }

    public function empezarPartida($idPartida)
    {
        event(new EmpezarPartida($idPartida));
        return response()->json([
            'message' => 'Partida iniciada correctamente',
            'id' => $idPartida
        ]);
    }

    public function obtenerMiRol(Request $request)
    {
        $user = $request->user();
        $jugador = $user->jugador;

        $request->validate([
            'id_partida' => 'required|exists:partidas,id'
        ]);

        $asignacion = JugadorPartidaPersonaje::where('id_partida', $request->id_partida)
            ->where('id_jugador', $jugador->id)
            ->first();

        if (!$asignacion) {
            // Si la partida no ha empezado, no tiene rol aún
            return response()->json(['rol_id' => null], 200);
        }

        return response()->json([
            'rol_id' => $asignacion->id_personaje,
            'estado' => $asignacion->estado
        ]);
    }

    public function rellenarBots(Request $request, $idPartida)
    {
        $partida = Partida::findOrFail($idPartida);

        $numJugadores = $request->input('numJugadores', 0);
        $minJugadores = 15;

        $faltantes = $minJugadores - $numJugadores;

        if ($faltantes <= 0) {
            return response()->json([
                'ok' => true,
                'botsAñadidos' => []
            ]);
        }

        $bots = Jugador::where('bot', true)
            ->take($faltantes)
            ->get();

        foreach ($bots as $bot) {
            $partida->jugadoresLobby()->attach($bot->id, [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            JugadorPartidaPersonaje::updateOrCreate(
                [
                    'id_jugador' => $bot->id,
                    'id_partida' => $partida->id
                ],
                [
                    'id_personaje' => null, // Se asignará al iniciar partida
                    'estado' => 1,
                    'votos' => 0
                ]
            );
        }
        return response()->json([
            'ok' => true,
        ]);
    }

    public function ganarPartida(Request $request, $idPartida)
    {
        $idJugador = $request->idJugador;

        $jugador = Jugador::findOrFail($idJugador);

        $jugador->partidas()->updateExistingPivot($idPartida, [
            'ganadas' => 1,
            'perdidas' => 0,
        ]);

        return response()->json([
            'message' => 'Partida registrada como ganada y finalizada.'
        ]);
    }

    public function perderPartida(Request $request, $idPartida)
    {
        $idJugador = $request->idJugador;

        $jugador = Jugador::findOrFail($idJugador);

        $jugador->partidas()->updateExistingPivot($idPartida, [
            'ganadas' => 0,
            'perdidas' => 1,
        ]);

        return response()->json([
            'message' => 'Partida registrada como ganada y finalizada.'
        ]);
    }

    public function finalizarPartida(Request $request, $idPartida)
    {

        $partida = Partida::find($idPartida);
        $equipoGanador = $request->equipo;
        if (!$partida) {
            return response()->json(['error' => 'Partida no encontrada'], 404);
        }


        $jugadores = $partida->jugadoresPartidaEstado()->get();

        foreach ($jugadores as $jugador) {
            $idPersonaje = $jugador->pivot->id_personaje;
            $esLobo = ($idPersonaje == 2);
            $haGanado = false;

            if ($equipoGanador === 'lobos') {
                if ($esLobo)
                    $haGanado = true;
            } else {
                if (!$esLobo)
                    $haGanado = true;
            }


            DB::table('historial_partidas_jugadores')->updateOrInsert(
                [
                    'id_partida' => $idPartida,
                    'id_jugador' => $jugador->id,

                ],
                [
                    'id_personaje' => $idPersonaje,
                    'ganadas' => $haGanado ? 1 : 0,
                    'perdidas' => $haGanado ? 0 : 1,
                    'estado' => 0, // Terminada
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
        $partida->estado = 3;
        $partida->save();

        broadcast(new FinalizarPartida($idPartida, $equipoGanador));

        return response()->json([
            'ok' => true,
            'mensaje' => "Estado actualizado a {$partida->estado}"
        ]);
    }

}


