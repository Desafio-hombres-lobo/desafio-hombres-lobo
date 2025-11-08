<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

    public function index()
    {
        $usuarios = User::all();
        return $usuarios;
    }


    public function store(StoreUserRequest $request)
    {
        $datos = $request->validated();

        $user = User::create([
            'name' => $datos['name'],
            'email' => $datos['email'],
            'nickname' => $datos['nickname'],
            'password' => $datos['password']
        ]);

        return response()->json($user, 201);
    }


    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return $user;
    }


    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        $datos = $request->validated();

        $user->update($datos);
        return response()->json($user, 201);

    }


    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $userId = $user->id;
        $user->delete();
        return response()->json("Usuario $userId borrado con exito", 200);
    }
}
