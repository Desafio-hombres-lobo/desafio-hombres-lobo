<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Jugador;
use App\Models\Partida;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum; // Importante para definir habilidades si es necesario

class HostTest extends TestCase
{
    use RefreshDatabase;

    public function test_devuelve_true_si_usuario_es_host()
    {
        $user = User::factory()->create();
        $jugador = Jugador::factory()->create(['id_usuario' => $user->id]);
        $partida = Partida::factory()->create(['creador_id' => $jugador->id]);

        // CORRECCIÓN 1: La URL correcta es /api/partida/host
        // CORRECCIÓN 2: Agregamos ['usuario'] en actingAs por si tu middleware lo requiere
        Sanctum::actingAs($user, ['usuario']);

        $response = $this->postJson('/api/partida/host', [
            'id_partida' => $partida->id
        ]);

        $response->assertStatus(200)
            ->assertJson(['esHost' => true]);
    }

    public function test_devuelve_false_si_usuario_no_es_host()
    {
        $user = User::factory()->create();
        Jugador::factory()->create(['id_usuario' => $user->id]);

        $otroJugador = Jugador::factory()->create();
        $partida = Partida::factory()->create(['creador_id' => $otroJugador->id]);

        Sanctum::actingAs($user, ['usuario']);

        // CORRECCIÓN URL
        $response = $this->postJson('/api/partida/host', [
            'id_partida' => $partida->id
        ]);

        $response->assertStatus(200)
            ->assertJson(['esHost' => false]);
    }

    public function test_error_404_si_partida_no_existe()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['usuario']);

        // CORRECCIÓN URL
        $response = $this->postJson('/api/partida/host', [
            'id_partida' => 99999
        ]);

        $response->assertNotFound();
    }

    public function test_error_validacion_si_falta_id_partida()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['usuario']);

        // CORRECCIÓN URL
        $response = $this->postJson('/api/partida/host', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['id_partida']);
    }
}