<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function login_falla_si_usuario_no_existe()
    {
        $datos = [
            'usuario' => 'noexiste@test.com',
            'password' => '123456'
        ];

        $response = $this->postJson('/api/login', $datos);

        $response->assertStatus(404)
                 ->assertJson([
                     'error' => 'usuario'
                 ]);
    }

    /** @test */
    public function login_falla_si_password_incorrecta()
    {
        $user = User::factory()->create([
            'email' => 'marta@test.com',
            'nickname' => 'marta',
            'password' => bcrypt('Password123@')
        ]);

        $datos = [
            'usuario' => 'marta@test.com',
            'password' => 'erordepassword'
        ];

        $response = $this->postJson('/api/login', $datos);

        $response->assertStatus(401)
                 ->assertJson([
                     'error' => 'password'
                 ]);
    }
}
