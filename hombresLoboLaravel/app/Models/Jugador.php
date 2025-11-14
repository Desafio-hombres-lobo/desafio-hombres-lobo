<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    protected $table = 'jugadores';
    protected $fillable = [
        'id_usuario',
        'nickname'
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
}
