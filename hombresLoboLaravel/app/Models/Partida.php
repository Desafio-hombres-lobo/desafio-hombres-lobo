<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partida extends Model
{
    protected $table = 'partidas';
    protected $primaryKey = 'id_partida';
    protected $fillable = ['id_creador', 'nombre', 'codigo'];

    public function creador()
    {
        return $this->belongsTo(User::class, 'id_creador');
    }
}


