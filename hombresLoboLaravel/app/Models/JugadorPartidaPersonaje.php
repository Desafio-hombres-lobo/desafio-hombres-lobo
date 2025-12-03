<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JugadorPartidaPersonaje extends Model
{
    use HasFactory;

    protected $table = 'jugador_partida_personajes';

    protected $fillable = [
        'id_jugador',
        'id_partida',
        'id_personaje',
        'estado',
        'votos'
    ];

    // Estado
    const ESTADO_ELIMINADO = 0;
    const ESTADO_VIVO = 1;
    const ESTADO_VOTADO = 2;

    public function jugador() {
    return $this->belongsTo(Jugador::class, 'id_jugador');
    }
}
