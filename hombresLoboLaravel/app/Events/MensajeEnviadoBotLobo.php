<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Jugador;

class MensajeEnviadoBotLobo implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $usuario;
    public $mensaje;
    public $idPartida;

    public function __construct($mensaje, $nickname, $idPartida)
    {
        $this->usuario = $nickname;
        $this->mensaje = $mensaje;
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
        return 'nuevo-mensaje-lobos';
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