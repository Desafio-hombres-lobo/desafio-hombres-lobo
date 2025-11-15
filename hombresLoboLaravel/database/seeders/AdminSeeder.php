<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Roles_administracion;
use App\Http\Controllers\JugadorController;
class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRol = Roles_administracion::where('nombre', 'admin')->first();

        $adminUser = User::create([
            'name' => 'Super admin',
            'nickname' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('superadmin'),
            'rol' => $adminRol->id,
        ]);

        $jugadorController = new JugadorController();
        $jugadorController->crearJugador($adminUser);
    }
}
