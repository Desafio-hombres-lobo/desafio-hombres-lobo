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
        $urlFoto = 'https://res.cloudinary.com/dj2m9tuoz/image/upload/v1763420201/fotos_perfil/p2i7pZyHP1527W83P38Os4pEVA8xRAy0nRGBj7vC.jpg';
        $adminUser = User::create([
            'name' => 'Super admin',
            'nickname' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('superadmin'),
            'rol' => $adminRol->id,
            'foto_perfil' => $urlFoto
        ]);

        $jugadorController = new JugadorController();
        $jugadorController->crearJugador($adminUser);
    }
}
