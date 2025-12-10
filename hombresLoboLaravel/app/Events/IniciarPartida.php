<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IniciarPartida implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $partida;
    public function __construct($idPartida)
    {
        $this->partida = $idPartida;

    }

    public function broadcastOn()
    {
        return new Channel('lobby' . $this->partida);
    }

    public function broadcastAs()
    {
        return 'iniciar.juego';
    }

    public function broadcastWith()
    {
        return [
            'partida' => $this->partida
        ];
    }
}
