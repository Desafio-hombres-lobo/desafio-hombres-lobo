<?php

namespace App\Http\Controllers;

use App\Http\Requests\JugadorRequest;
use App\Models\Jugador;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class JugadorController extends Controller
{
    public function crearJugador(User $user)
    {
        $jugador = $user->jugador()->create([
            'nickname' => $user->nickname
        ]);
        return $jugador;
    }

    public function update(JugadorRequest $request)
    {
        // Usuario autenticado
        $user = $request->user();

        // Jugador de ese usuario
        $jugador = $user->jugador;

        if (!$jugador) {
            return response()->json(['error' => 'No se encontró el perfil del jugador'], 404);
        }

        $datos = $request->validated();

        $jugador->update($datos);

        return response()->json($jugador, 200);

    }

    public function show(Request $request)
    {
        $user = $request->user();

        $jugador = $user->jugador;

        if (!$jugador) {
            return response()->json(['error' => 'Perfil de jugador no encontrado'], 404);
        }

        $totalGanadas = $jugador->partidas()->sum('ganadas');
        $totalPerdidas = $jugador->partidas()->sum('perdidas');
        $totalPartidas = $jugador->partidas()->count();

        return response()->json([
            'nickname' => $jugador->nickname,
            'partidas_jugadas' => $totalPartidas,
            'partidas_ganadas' => (int) $totalGanadas,
            'partidas_perdidas' => (int) $totalPerdidas,
        ]);
    }

    public function showJugador($id){
        $jugador = Jugador::find($id);
        if (!$jugador) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($jugador);

    }

    public function cambiarPassword(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Generar una nueva contraseña aleatoria (texto plano)
        $nuevaPassword = Str::random(10);

        // Actualizar la contraseña en la BD
        $user->password = $nuevaPassword;
        $user->save();
        $user->update([
            'password' => $nuevaPassword
        ]);

        // Datos del correo
        $datos = [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $nuevaPassword
        ];

        $email = $user->email;

        try {
            Mail::send('vista_correo', $datos, function ($message) use ($email) {
                $message->to($email)
                    ->subject('Reestablecer Contraseña')
                    ->from(env('MAIL_FROM_ADDRESS'), 'Solicitud Reestablecer Contraseña Aceptada');
            });

            return response()->json([
                'exito' => true,
                'mensaje' => 'Se ha enviado una nueva contraseña a tu correo.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'mensaje' => 'Error al enviar el correo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function jugadorActual(Request $request)
    {
        $jugador = $request->user();
        return response()->json($jugador);
    }
}
