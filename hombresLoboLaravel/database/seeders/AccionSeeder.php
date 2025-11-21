<?php

namespace Database\Seeders;

use App\Models\Accion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Acción común para todos
        Accion::create(['nombre' => 'Votar']);

        // Acciones Lobos
        Accion::create(['nombre' => 'Matar']);

        // Acciones Vidente
        // Accion::create(['nombre' => 'Ver Rol']);

        // Acciones Bruja
        // Accion::create(['nombre' => 'Lanzar Poción de Vida']);
        // Accion::create(['nombre' => 'Lanzar Poción de Muerte']);

        // Acciones Cazador
        // Accion::create(['nombre' => 'Disparar']);

        // Acciones Cupido
        // Accion::create(['nombre' => 'Enamorar']);

    }
}
