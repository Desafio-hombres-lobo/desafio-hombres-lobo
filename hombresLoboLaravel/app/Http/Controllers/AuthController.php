<?php

namespace App\Http\Controllers;

use App\Models\Roles_administracion;
use App\Http\Requests\StoreUserRequest;
use App\Http\Controllers\JugadorController;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\Concerns\Has;

class AuthController extends Controller
{
    public function registrar(StoreUserRequest $request, JugadorController $controller)
    {
        $datos = $request->validated();
        $user = User::create([
            'name' => $datos['name'],
            'email' => $datos['email'],
            'nickname' => $datos['nickname'],
            'password' => Hash::make($datos['password']),
            'rol' => 2
        ]);
        $jugadorController = new JugadorController();
        $jugador = $jugadorController->crearJugador($user);

        return response()->json([
            'exito' => true,
            'usuario' => $user->nickname,
        ]);
    }
    public function loguear(LoginRequest $request)
    {
        $datos = $request->validated();
        $campo = filter_var($datos['usuario'], FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'nickname';
        $credenciales = [
            $campo => $datos['usuario'],
            'password' => $datos['password']
        ];
        $login = Auth::attempt($credenciales);

        if ($login) {
            $user = Auth::user();
            $user->load('role');
            $abilities = [];
            $rolNombre = $user->role->nombre;

            switch ($rolNombre) {
                case 'usuario':
                    $abilities = ['usuario'];
                    break;
                case 'admin':
                    $abilities = ['admin', 'usuario'];
                    break;
            }


            $token = $user->createToken('auth_token', $abilities)->plainTextToken;

            return response()->json([
                'token' => $token,
                'usuario' => $user->nickname,
                'rol' => $rolNombre,
                //'jugador' => $user->jugador->nickname
            ], 200);
        } else {
            $user = User::where('email', $datos['usuario'])
                ->orWhere('nickname', $datos['usuario'])
                ->first();
            if (!$user) {
                return response()->json([
                    'error' => 'usuario',
                    'mensaje' => 'No se encontró ningún usuario con ese correo o apodo.'
                ], 404);
            } else {
                return response()->json([
                    'error' => 'password',
                    'mensaje' => 'La contraseña es incorrecta.'
                ], 401);
            }
        }
    }
}
