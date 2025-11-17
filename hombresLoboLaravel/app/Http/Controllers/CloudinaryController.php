<?php

namespace App\Http\Controllers;

use App\Http\Requests\FotoRequest;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
class CloudinaryController extends Controller
{
    public function cambiarFoto(FotoRequest $request)
    {
        $request->validated();
        //Al parecer laravel automaticamente revisa el token y te devuelve el usuario, cuando termine la funcion voy a probarlo
        $usuario = $request->user();

        //Si el usuario tiene una foto se la borramos para dejar hueco en la bbdd
        if ($usuario->foto_perfil) {
            Cloudinary::destroy($usuario->foto_perfil);
        }


        $resultado = $request->file('foto')->storeOnCloudinary('fotos-perfil');

        return response()->json([
            'exito' => true,
            // getSecurePath devuelve la url de la foto
            'url' => $resultado->getSecurePath()
        ]);
    }
}
