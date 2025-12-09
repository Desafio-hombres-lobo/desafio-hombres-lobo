<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CambiarTemporizador implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $segundos;
    public $partidaId;

    public function __construct($segundos, $partidaId)
    {
        $this->segundos = $segundos;
        $this->partidaId = $partidaId;

    }

   
public function broadcastOn(): Channel{
    return new Channel('aldea' . $this->partidaId);}

    public function broadcastAs(): string
    {
        return ('cambio-temporizador');
    }
}
