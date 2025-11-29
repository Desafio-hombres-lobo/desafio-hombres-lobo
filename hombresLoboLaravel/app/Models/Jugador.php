<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;
use App\Models\Partida;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Jugador extends Model
{
    use HasFactory;
    protected $table = 'jugadores';
    protected $fillable = [
        'id_usuario',
        'nickname',
        'bot'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function partidas(): BelongsToMany
    {
        return $this->belongsToMany(Partida::class, 'historial_partidas_jugadores', 'id_jugador', 'id_partida')
            ->withPivot('ganadas', 'perdidas')
            ->withTimestamps();
    }

    // Todas las partidas en las que participa un jugador
    public function partidasEstado(): BelongsToMany
    {
        return $this->belongsToMany(Partida::class, 'jugador_partida_personajes')
            ->withPivot('id_personaje', 'estado')
            ->withTimestamps();
    }

    // Personajes que tiene el jugador en cada partida
    public function personajesEnPartidas(): BelongsToMany
    {
        return $this->belongsToMany(Personaje::class, 'jugador_partida_personajes')
            ->withPivot('id_partida', 'estado')
            ->withTimestamps();
    }
    public function partidasActivas(): BelongsToMany
    {
        return $this->belongsToMany(
            Partida::class,
            'jugador_partida',
            'jugador_id',
            'partida_id'
        )->withTimestamps();
    }
}
