<?php

namespace App\Http\Controllers;
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
        Partida::create([
            'creador_id' => $jugador->id,
            'nombre' => $request->nombre,
            'num_jugadores' => $request->num_jugadores,
            'estado' => 'iniciando',
            'codigo' => Str::upper(Str::random(6)),
        ]);

        return response()->json([
    'success' => true,
    'message' => 'Partida creada correctamente.'
]);

    }
}


