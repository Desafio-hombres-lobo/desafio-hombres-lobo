<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jugador_partida_personajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_jugador')->constrained('jugadores')->onDelete('cascade');
            $table->foreignId('id_partida')->constrained('partidas')->onDelete('cascade');
            $table->foreignId('id_personaje')->nullable()->constrained('personajes')->onDelete('cascade');
            $table->unsignedTinyInteger('estado')->default(1); // 0: muerto, 1: vivo, 2: votado
            $table->unsignedTinyInteger('votos')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jugador_partida_personajes');
    }
};
