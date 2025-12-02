<?php

namespace Database\Factories;

use App\Models\Jugador;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jugador>
 */
class JugadorFactory extends Factory
{
    protected $model = Jugador::class;
    public function definition(): array
    {
        return [
            'nickname'   =>  fake()->unique()->firstName(),
            'id_usuario' => null,
            'bot'        => true,
        ];
    }
}
