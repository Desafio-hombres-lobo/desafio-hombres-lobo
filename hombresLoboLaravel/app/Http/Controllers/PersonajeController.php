<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personaje;


class PersonajeController extends Controller
{

    public function index()
    {
        $personajes = Personaje::all();
        return $personajes;
    }


    public function show(string $id)
    {
        $personaje = Personaje::findOrFail($id);

        return $personaje;
    }

    public function accionesDelPersonaje(Request $request){
        $user = $request->user();
        $jugador = $user->jugador;

        if (!$jugador) {
            return response()->json(['error' => 'No se encontró el perfil del jugador'], 404);
        }

        $personaje = Personaje::findOrFail($request->id_personaje);

        $acciones_personaje = $personaje->acciones;

        $datos = [];

        foreach ($acciones_personaje as $accion) {
            $datos[] = [
                'id_jugador' => $jugador->id,
                'jugador' => $jugador->nickname,
                'id_accion' => $accion->id,
                'nombre_accion' => $accion->nombre,
                'id_personaje' => $personaje->id,
                'nombre_personaje' => $personaje->nombre
            ];

        }

        return response()->json(['acciones' => $datos], 200);

    }


}
