<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partida extends Model
{
    use HasFactory;
    protected $table = 'partidas';
    protected $primaryKey = 'id';
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


    public function jugadoresPartidaEstado()
    {
        return $this->belongsToMany(
            Jugador::class,
            'jugador_partida_personajes',
            'id_partida',
            'id_jugador'
        )->withPivot('id_personaje', 'estado', 'votos');
    }


    // Personajes de la partida con jugador y estado
    public function personajes(): BelongsToMany
    {
        return $this->belongsToMany(Personaje::class, 'jugador_partida_personajes')
            ->withPivot('id_jugador', 'estado')
            ->withTimestamps();
    }
    public function jugadoresLobby()
    {
        return $this->belongsToMany(
            Jugador::class,
            'jugador_partida',
            'id_partida',
            'id_jugador'
        )->withTimestamps();
    }
}
