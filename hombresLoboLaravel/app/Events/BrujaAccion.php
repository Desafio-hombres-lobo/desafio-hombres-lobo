<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BrujaAccion implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // En el constructor:
    public $idPartida;
    public $tipoAccion;
    public $idObjetivo;

    public function __construct($idPartida, $tipoAccion, $idObjetivo)
    {
        $this->idPartida = $idPartida;
        $this->tipoAccion = $tipoAccion;
        $this->idObjetivo = $idObjetivo;
    }

    public function broadcastOn()
    {
        return new Channel('aldea' . $this->idPartida);
    }

    public function broadcastAs()
    {
        return 'bruja-accion';
    }
}
