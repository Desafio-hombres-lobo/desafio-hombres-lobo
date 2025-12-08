<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VerLobos implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $idPartida;

    public function __construct($idPartida)
    {
        $this->idPartida = $idPartida;
    }

    // Canal público "chat"
    public function broadcastOn(): Channel
    {
        return new Channel('lobos' . $this->idPartida);
    }

    // Nombre del evento en el cliente
    public function broadcastAs(): string
    {
        return 'ninia-habilidad';
    }

}
