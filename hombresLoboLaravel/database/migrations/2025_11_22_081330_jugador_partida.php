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
        Schema::create('jugador_partida', function (Blueprint $table) {
            $table->unsignedBigInteger('id_jugador');
            $table->unsignedBigInteger('id_partida');

            $table->boolean('eliminado')->default(false);

            $table->timestamps();

            // Foreign keys
            $table->foreign('id_jugador')->references('id')->on('jugadores')->onDelete('cascade');
            $table->foreign('id_partida')->references('id')->on('partidas')->onDelete('cascade');

            // Clave única para evitar duplicados
            $table->unique(['id_partida', 'id_jugador']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jugador_partida');
    }
};
