<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CambiarFase implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $fase;
    public $partidaId;
    public $tiempoFin;
    public $ronda;

    public function __construct($partidaId, $fase, $tiempoFin, $ronda)
    {
        $this->partidaId = $partidaId;
        $this->tiempoFin = $tiempoFin;
        $this->fase = $fase;
        $this->ronda = $ronda;

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): Channel
    {
        return new Channel('aldea' . $this->partidaId);
    }

    public function broadcastAs(): string
    {
        return ('cambio-fase');
    }
}
