<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $msg = $request->input('message');
        $idPartida = $request->input('partida_id');


        event(new MessageSent($msg, $idPartida));

        return response()->json([
            'status' => 'ok',
            'message' => $msg
        ]);
    }

}
