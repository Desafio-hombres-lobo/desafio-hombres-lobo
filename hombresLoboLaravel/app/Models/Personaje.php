<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Personaje extends Model
{
    protected $table = 'personajes';
    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    public function acciones(): BelongsToMany
    {
        return $this->belongsToMany(Accion::class, 'acciones_personajes', 'id_personaje', 'id_accion');
    }
}
