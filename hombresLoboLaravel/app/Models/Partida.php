<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partida extends Model
{
    protected $table = 'partidas';
    // protected $primaryKey = 'id_partida';
    protected $fillable = ['creador_id', 'nombre', 'num_jugadores', 'codigo'];

    public function creador()
    {
        return $this->belongsTo(User::class, 'id_creador');
    }


    public function jugadores(): BelongsToMany
    {
        return $this->belongsToMany(Jugador::class, 'historial_partidas_jugadores', 'id_partida', 'id_jugador')
                    ->withPivot('ganadas', 'perdidas')
                    ->withTimestamps();
    }
}
