<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Jugador;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $msg = $request->input('message');
        $idPartida = $request->input('partida_id');

        $user = $request->user()->jugador;

        broadcast(new MessageSent($msg, $idPartida, $user->nickname));

        return response()->json([
            'status' => 'ok',
            'message' => $msg,
            'user' => $user->nickname
        ]);
    }

        public function sendMensajeBot(Request $request, $bot)
    {
        $msg = $request->input('message');
        $idPartida = $request->input('partida_id');

        $jugador=Jugador::find($bot);

        broadcast(new MessageSent($msg, $idPartida, $jugador->nickname));

        return response()->json([
            'status' => 'ok',
            'message' => $msg,
            'user' => $jugador->nickname
        ]);
    }

}
