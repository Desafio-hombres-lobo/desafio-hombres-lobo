<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    protected $table = 'jugadores';
    protected $fillable = [
        'id_usuario',
        'nickname'
    ];
    public function jugador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users');
    }
}
