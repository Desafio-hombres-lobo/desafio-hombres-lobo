<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $idPartida;
    public $nickname;

    public function __construct($message, $idPartida, $nickname)
    {
        $this->message = $message;
        $this->idPartida = $idPartida;
        $this->nickname = $nickname;
    }


    public function broadcastOn(): Channel
    {
        return new Channel('lobby' . $this->idPartida);
    }

    // Nombre del evento en el cliente
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    // Datos que se envían al cliente
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'username' => $this->nickname
        ];
    }
}
