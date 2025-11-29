<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voto extends Model
{
    protected $fillable = [
        'id_partida',
        'id_jugador',
        'id_jugador_votado',
        'ronda',
    ];

    public function partida()
    {
        return $this->belongsTo(Partida::class, 'id_partida');
    }

    public function jugador()
    {
        return $this->belongsTo(Jugador::class, 'id_jugador');
    }

    public function jugadorVotado()
    {
        return $this->belongsTo(Jugador::class, 'id_jugador_votado');
    }
}
