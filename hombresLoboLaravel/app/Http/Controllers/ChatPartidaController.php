<?php

namespace App\Http\Controllers;

use App\Events\MensajeEnviado;
use Illuminate\Http\Request;

class ChatPartidaController extends Controller
{
    public function enviar(Request $request)
    {
        $msg = $request->input('mensaje');
        $usuario = $request->user();
        event(new MensajeEnviado($msg, $usuario));
        return response()->json(['status' => 'ok']);
    }

}
