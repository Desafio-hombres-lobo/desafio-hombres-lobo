<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Roles_administracion;

class RolesAdministracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear Rol de Admin
        Roles_administracion::firstOrCreate([
            'nombre' => 'admin'
        ]);

        // Crear Rol de Usuario
        Roles_administracion::firstOrCreate([
            'nombre' => 'usuario'
        ]);
    }
}
