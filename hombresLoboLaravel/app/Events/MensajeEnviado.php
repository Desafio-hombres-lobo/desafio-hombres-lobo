<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class MensajeEnviado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $usuario;
    public $mensaje;

    public function __construct($mensaje, User $usuario)
    {
        $this->usuario = $usuario->jugador->nickname;
        $this->mensaje = $mensaje;
    }

    // Canal público "chat"
    public function broadcastOn(): Channel
    {
        return new Channel('chat');
    }

    // Nombre del evento en el cliente
    public function broadcastAs(): string
    {
        return 'nuevo-mensaje';
    }

    // Datos que se envían al cliente
    public function broadcastWith(): array
    {
        return [
            'usuario' => $this->usuario,
            'mensaje' => $this->mensaje,
        ];
    }
}
