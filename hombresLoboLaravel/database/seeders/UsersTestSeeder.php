<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Jugador;
use Illuminate\Support\Facades\Hash;

class UsersTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Creamos 10 usuarios de prueba
        for ($i = 1; $i <= 10; $i++) {

            // 1. Crear el Usuario (Login)
            $user = User::create([
                'name' => "usuario$i",
                'nickname' => "usuario$i",
                'email' => "usuario$i@test.com", // Email ficticio
                'password' => Hash::make("test$i"), // Contraseña encriptada: test1, test2...
                'rol' => 2, // Asignamos rol básico
            ]);

            Jugador::create([
                'id_usuario' => $user->id,
                'nickname' => "usuario$i",
                'bot' => false,
                // Añade aquí campos extra si son obligatorios en tu BD, ej: 'avatar' => ...
            ]);


        }
    }
}