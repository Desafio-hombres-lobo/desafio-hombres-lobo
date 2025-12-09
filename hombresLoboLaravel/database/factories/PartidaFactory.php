<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartidaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->sentence(3),
            'num_jugadores' => $this->faker->numberBetween(4, 10),
            'codigo' => $this->faker->unique()->bothify('????##'),
            // Si no pasamos un creador_id manualmente, crea un usuario nuevo para asignarlo
            'creador_id' => User::factory(),
        ];
    }
}