<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $msg = $request->input('message');

        // Emitimos el evento
        event(new MessageSent($msg));

        // Devolvemos confirmación
        return response()->json(['status' => 'ok']);
    }
}
