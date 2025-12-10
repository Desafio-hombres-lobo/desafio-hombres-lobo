<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Accion;

class AccionController extends Controller
{
        public function index()
    {
        $acciones = Accion::all();
        return $acciones;
    }


    public function show(string $id)
    {
        $accion = Accion::findOrFail($id);

        return $accion;
    }
}
