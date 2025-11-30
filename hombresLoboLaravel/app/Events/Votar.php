<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Votar implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $idVotante;
        public $idVotado;
        public $idPartida;

        public function __construct($idPartida, $idVotante, $idVotado)
        {
            $this->idPartida = $idPartida;
            $this->idVotante = $idVotante;
            $this->idVotado = $idVotado;
        }

        public function broadcastOn()
        {
            return new Channel("aldea.{$this->idPartida}");
        }

        public function broadcastAs()
        {
            return "voto";
        }
}
