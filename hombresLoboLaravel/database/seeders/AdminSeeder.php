<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Roles_administracion;
class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRol = Roles_administracion::where('nombre', 'admin')->first();

        User::create([
            'name' => 'Super admin',
            'nickname' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('superadmin'),
            'rol' => $adminRol->id,
        ]);


    }
}
