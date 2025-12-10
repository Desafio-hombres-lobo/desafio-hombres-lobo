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
         Schema::create('votos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_partida');
            $table->unsignedBigInteger('id_jugador');
            $table->unsignedBigInteger('id_jugador_votado');

            $table->integer('ronda');

            $table->timestamps();

            $table->foreign('id_partida')
                ->references('id')
                ->on('partidas')
                ->onDelete('cascade');

            $table->foreign('id_jugador')
                ->references('id')
                ->on('jugadores')
                ->onDelete('cascade');

            $table->foreign('id_jugador_votado')
                ->references('id')
                ->on('jugadores')
                ->onDelete('cascade');


            $table->unique(['id_partida', 'ronda', 'id_jugador']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
