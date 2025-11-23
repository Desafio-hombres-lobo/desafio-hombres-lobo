<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerJoined implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $player;
    public $gameId;

    public function __construct($player, $gameId)
    {
        $this->player = $player;
        $this->gameId = $gameId;
    }


    public function broadcastOn(): Channel
    {
        return new Channel('game.' . $this->gameId);
    }


    public function broadcastAs(): string
    {
        return 'player.joined';
    }


    public function broadcastWith(): array
    {
        return [
            'player' => $this->player,
            'game_id' => $this->gameId,
        ];
    }
}
