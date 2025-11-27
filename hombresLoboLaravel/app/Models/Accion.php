<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Accion extends Model
{
    protected $table = 'acciones';
    protected $fillable = ['nombre'];

    public function personajes(): BelongsToMany
    {
        return $this->belongsToMany(Personaje::class, 'acciones_personajes', 'id_accion', 'id_personaje');
    }
}
