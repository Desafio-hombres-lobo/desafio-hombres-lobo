<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VotacionTerminada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $resultado; // "eliminado" | "empate"
    public $eliminado;
    public $idPartida;
    public $idPersonaje;
    public $idEliminado;

    public function __construct($idPartida, $resultado, $eliminado, $idPersonaje, $idEliminado)
    {
        $this->idPartida = $idPartida;
        $this->resultado = $resultado;
        $this->eliminado = $eliminado;
        $this->idPersonaje = $idPersonaje;
        $this->idEliminado = $idEliminado;
    }

    public function broadcastOn()
    {
        return new Channel('aldea' . $this->idPartida);
    }

    public function broadcastAs()
    {
        return "votacion-terminada";
    }
}
