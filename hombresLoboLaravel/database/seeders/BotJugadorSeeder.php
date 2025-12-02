<?php

namespace Database\Seeders;

use App\Models\Jugador;
use Illuminate\Database\Seeder;

class BotJugadorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Jugador::factory()->count(30)->create();
    }
}
