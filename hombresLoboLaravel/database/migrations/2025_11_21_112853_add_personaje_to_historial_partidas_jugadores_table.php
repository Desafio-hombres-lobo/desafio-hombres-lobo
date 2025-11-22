<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('historial_partidas_jugadores', function (Blueprint $table) {
            // El personaje aún es null en el lobby, se asigna en partida
            $table->foreignId('id_personaje')
                    ->nullable()
                    ->after('id_jugador')
                    ->constrained('personajes')
                    ->onDelete('set null');

            // Añadir estado (0: terminada, 1: en curso)
            $table->integer('estado')->default(1)->after('id_personaje');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_partidas_jugadores', function (Blueprint $table) {
            $table->dropForeign(['id_personaje']);
            $table->dropColumn(['id_personaje', 'estado']);
        });
    }
};
