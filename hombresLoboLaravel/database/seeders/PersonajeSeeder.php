<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Personaje;
use App\Models\Accion;

class PersonajeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Recuperar las acciones
        $accionVotar = Accion::where('nombre', 'Votar')->first();
        $accionMatar = Accion::where('nombre', 'Matar')->first();
        $accionVer = Accion::where('nombre', 'Ver Rol')->first();
        $accionRevivir = Accion::where('nombre', 'Lanzar Poción de Vida')->first();
        $accionMatarBruja = Accion::where('nombre', 'Lanzar Poción de Muerte')->first();
        $accionDisparar = Accion::where('nombre', 'Disparar')->first();
        $accionEnamorar = Accion::where('nombre', 'Enamorar')->first();
        $accionProteger = Accion::where('nombre', 'Proteger')->first();

        // CREACIÓN DE PERSONAJES Y ASIGNACIÓN DE ACCIONES

        // ALDEANO
        $aldeano = Personaje::create([
            'nombre' => 'Aldeano',
            'descripcion' => 'Su única arma es el análisis y su voto para linchar al culpable.'
        ]);

        // El aldeano solo puede votar
        if ($accionVotar)
            $aldeano->acciones()->attach($accionVotar->id);


        // HOMBRE LOBO
        $lobo = Personaje::create([
            'nombre' => 'Lobo',
            'descripcion' => 'Cada noche devora a un aldeano. De día se hace pasar por uno de ellos.'
        ]);

        // El lobo puede votar de día y Mmatar de noche
        $idsLobo = array_filter([$accionVotar?->id, $accionMatar?->id]);
        $lobo->acciones()->attach($idsLobo);

        $niña = Personaje::create([
            'nombre' => 'Niña',
            'descripcion' => 'Es una aldeana muy curiosa. Durante la fase de noche tiene la habilidad prohibida de espiar el chat de los Lobos, pero debe tener cuidado: si es descubierta, su vida correrá peligro.'
        ]);

        //Bruja
        $bruja = Personaje::create([
            'nombre' => 'Bruja',
            'descripcion' => 'Tiene dos pociones, una para eliminar a un jugador y otra para salvar a una víctima de los lobos'
        ]);

    }
}
