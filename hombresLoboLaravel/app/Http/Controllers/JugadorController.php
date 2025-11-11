<?php

namespace App\Http\Controllers;

use App\Models\Jugador;
use App\Models\User;
use Illuminate\Http\Request;

class JugadorController extends Controller
{
    public function crearJugador(User $user)
    {
        $jugador = $user->jugador()->create([
            'nickname' => $user->nickname
        ]);
        return $jugador;
    }
}
