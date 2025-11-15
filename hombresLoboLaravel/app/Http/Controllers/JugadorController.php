<?php

namespace App\Http\Controllers;

use App\Models\Jugador;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateUserRequest;


class JugadorController extends Controller
{
    public function crearJugador(User $user)
    {
        $jugador = $user->jugador()->create([
            'nickname' => $user->nickname
        ]);
        return $jugador;
    }

    public function update(UpdateUserRequest $request)
    {
        // Usuario autenticado
        $user = $request->user();

        // Jugador de ese usuario
        $jugador = $user->jugador;

        if (!$jugador) {
            return response()->json(['error' => 'No se encontró el perfil del jugador'], 404);
        }

        $datos = $request->validated();

        $jugador->update($datos);

        return response()->json($jugador, 200);

    }

   public function show(Request $request)
    {
        $user = $request->user();

        $jugador = $user->jugador;

        if (!$jugador) {
            return response()->json(['error' => 'Perfil de jugador no encontrado'], 404);
        }

        $totalGanadas = $jugador->partidas()->sum('ganadas');
        $totalPerdidas = $jugador->partidas()->sum('perdidas');
        $totalPartidas = $jugador->partidas()->count();

        return response()->json([
            'nickname' => $jugador->nickname,
            'partidas_jugadas' => $totalPartidas,
            'partidas_ganadas' => (int) $totalGanadas,
            'partidas_perdidas' => (int) $totalPerdidas,
        ]);
    }
}
