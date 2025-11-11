<?php

namespace App\Http\Controllers;
use App\Models\Partida;
use Illuminate\Http\Request;

class PartidaController extends Controller

{
    public function index()
    {
    $partidas = Partida::all();
    return response()->json($partidas);
    }
}


