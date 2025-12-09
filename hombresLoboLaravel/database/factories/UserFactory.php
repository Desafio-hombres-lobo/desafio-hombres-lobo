<?php

namespace Database\Factories;

use App\Models\Roles_administracion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // CORRECCIÓN: Busca el rol 'usuario', si no existe (porque es un test), lo crea.
        $rolUsuario = Roles_administracion::firstOrCreate(
            ['nombre' => 'usuario']
            // Si tu tabla requiere más campos obligatorios aparte del nombre, añádelos aquí.
        );

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'nickname' => fake()->unique()->userName(),
            'rol' => $rolUsuario->id, // Usamos el ID del rol recuperado o creado
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
