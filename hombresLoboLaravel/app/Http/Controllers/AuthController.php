<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registrar(StoreUserRequest $request)
    {
        $datos = $request->validated();
        $user = User::create([
            'name' => $datos['name'],
            'email' => $datos['email'],
            'nickname' => $datos['nickname'],
            'password' => Hash::make($datos['password']),
        ]);
        return response()->json([
            'exito' => true,
            'nombre de usuario' => $user->nickname,
        ]);
    }
}
