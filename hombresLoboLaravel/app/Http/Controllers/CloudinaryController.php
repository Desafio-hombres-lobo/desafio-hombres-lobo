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
        $foto_default = 'https://res.cloudinary.com/dj2m9tuoz/image/upload/v1763404018/default_user_photo_mxc7ra.jpg';

        //Si el usuario tiene una foto se la borramos para dejar hueco en la bbdd, y ademas comprobamos que no sea la default para no borrarla
        if ($usuario->foto_perfil && $usuario->foto_perfil != $foto_default) {
            Cloudinary::destroy($usuario->foto_perfil);
        }


        $resultado = $request->file('foto')->storeOnCloudinary('fotos_perfil');
        $url = $resultado->getSecurePath();
        $usuario->update([
            'foto_perfil' => $url
        ]);

        return response()->json([
            'exito' => true,
            // getSecurePath devuelve la url de la foto
            'url' => $url
        ]);
    }
    public function cargarFoto(Request $request)
    {
        $user = $request->user();
        $foto = $user->foto_perfil;
        return response()->json([
            'foto' => $foto
        ]);
    }
}
