<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JugadorAbandono implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $partidaId;
    public $nombreJugador;

    public function __construct($partidaId, $nombreJugador)
    {
        $this->partidaId = $partidaId;
        $this->nombreJugador = $nombreJugador;
    }

    public function broadcastOn()
    {
        return new Channel('game.' . $this->partidaId);
    }

    public function broadcastAs()
    {
        return 'jugador.abandono';
    }

    public function broadcastWith()
    {
        return [
            'jugador' => $this->nombreJugador
        ];
    }
}
