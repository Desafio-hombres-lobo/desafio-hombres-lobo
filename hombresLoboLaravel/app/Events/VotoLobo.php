<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VotoLobo implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $idPartida;
    public $idVotante;
    public $idVotado;

    public function __construct($idPartida, $idVotante, $idVotado)
    {
        $this->idPartida = $idPartida;
        $this->idVotante = $idVotante;
        $this->idVotado = $idVotado;
    }

    public function broadcastOn()
    {
        return new Channel('lobos' . $this->idPartida);
    }


    public function broadcastAs()
    {
        return 'votos-lobos';
    }
}
