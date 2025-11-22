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

        $personaje = Personaje::findOrFail($request->id_personaje);

        $acciones_personaje = $personaje->acciones;

        $datos = [];

        foreach ($acciones_personaje as $accion) {
            $datos[] = [
                'jugador' => $jugador->nickname,
                'id_accion' => $accion->id,
                'nombre_accion' => $accion->nombre,
                'id_personaje' => $personaje->id,
                'nombre_personaje' => $personaje->nombre
            ];

        }

        return response()->json(['acciones' => $datos]);

    }


}
