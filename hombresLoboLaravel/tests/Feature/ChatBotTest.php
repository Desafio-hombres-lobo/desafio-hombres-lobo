<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;
use App\Models\User;
use App\Models\Jugador;
use App\Models\Roles_administracion;
use App\Events\MensajeEnviadoBot;
use Laravel\Sanctum\Sanctum;

class ChatBotTest extends TestCase
{
    // Esta linea resetea la BD después de cada test
    use RefreshDatabase;

    /** @test */
    public function un_usuario_autenticado_puede_enviar_un_mensaje_de_bot_y_se_emite_evento()
    {

        $rol = new Roles_administracion();
        $rol->nombre = 'usuario';
        $rol->save();

        Event::fake();

        // Crear un usuario para hacer la petición
        $user = User::factory()->create();

        // Crear bot
        $bot = Jugador::factory()->create([
            'nickname' => 'BotLobo'
        ]);

        Sanctum::actingAs(
            $user,
            ['usuario']
        );

        $payload = [
            'message' => 'Hola, soy un bot',
            'id_partida' => 123
        ];

        $response = $this->postJson("/api/chat/send/{$bot->id}", $payload);

        $response->assertOk();

        $response->assertJson([
            'status' => 'ok',
            'message' => 'Hola, soy un bot',
            'user' => 'BotLobo'
        ]);

        // Verificar que se dispara el evento de broadcast
        Event::assertDispatched(function (MensajeEnviadoBot $event) use ($payload, $bot) {
            return $event->mensaje === $payload['message'] &&
                   $event->usuario === $bot->nickname &&
                   $event->idPartida == $payload['id_partida'];
        });
    }
}
