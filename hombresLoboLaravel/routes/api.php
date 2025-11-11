<?php

use App\Http\Controllers\UserController, App\Http\Controllers\AuthController, App\Http\Controllers\PartidaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);

Route::post('/registrar', [AuthController::class, 'registrar']);

Route::get('/partidas', [PartidaController::class, 'index']);
