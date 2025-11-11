<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partida extends Model
{



    public function jugadores(): BelongsToMany
    {
        return $this->belongsToMany(Jugador::class, 'partidas_jugadores', 'id_partida', 'id_jugador')
                    ->withPivot('ganadas', 'perdidas')
                    ->withTimestamps();
    }
}
