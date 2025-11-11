<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Controllers\JugadorController;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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
        ]);
        $jugadorController = new JugadorController();
        $jugador = $jugadorController->crearJugador($user);

        return response()->json([
            'exito' => true,
            'nombre de usuario' => $user->nickname,
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

            $token = $user->createToken('auth_token', ['usuario'])->plainTextToken;

            return response()->json([
                'token' => $token
            ], 200);
        } else {
            return response()->json([
                'error' => true,
                'mensaje' => 'Algo ha salido mal'
            ]);
        }
    }
}
