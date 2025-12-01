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

    public function calcularVoto($idPartida, $bot)
    {
        $votos = Voto::where('id_partida', $idPartida)
                     ->get();

        // Jugadores vivos
        $jugadoresVivos = Jugador::where('id_partida', $idPartida)
                                 ->where('eliminado', false)
                                 ->get();

        // No puede votarse a sí mismo
        $jugadoresVivos = $jugadoresVivos->where('id', '!=', $bot->id);

        // Si es lobo no puede votar a lobos
        if ($bot->rol === 'lobo') {
            $jugadoresVivos = $jugadoresVivos->where('rol', '!=', 'lobo');
        }

        // Si no hay jugadores válidos ¿Pero siempre va a haber no?
        if ($jugadoresVivos->count() === 0) {
            return $jugadoresVivos->random()->id();
        }


        // Si no hay rondas anteriores → aleatorio
        if ($votos->count() === 0) {
            return $jugadoresVivos->random()->id;
        }


        $conteo = $votos->groupBy('id_jugador_votado')
                        ->map(fn($g) => $g->count());


        $maxVotos = $conteo->max();

        $masVotados = $conteo->filter(fn($c) => $c === $maxVotos)->keys();

        // Filtrar solo los que estén vivos y válidos ¿?
        $masVotados = $masVotados->filter(function ($id) use ($jugadoresVivos) {
            return $jugadoresVivos->contains('id', $id);
        });

        // Si no hay coincidencias aleatorio
        if ($masVotados->count() === 0) {
            return $jugadoresVivos->random()->id;
        }

        return $masVotados->random();
    }
}
