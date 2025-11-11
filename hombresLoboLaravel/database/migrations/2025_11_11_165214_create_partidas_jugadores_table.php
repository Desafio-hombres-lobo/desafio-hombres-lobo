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
        Schema::create('partidas_jugadores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_partida');
            $table->unsignedBigInteger('id_jugador');

            $table->integer('ganadas')->default(0);
            $table->integer('perdidas')->default(0);
            $table->timestamps();

            $table->foreign('id_partida')
                ->references('id')
                ->on('partidas')
                ->onDelete('cascade');

            $table->foreign('id_jugador')
                ->references('id')
                ->on('jugadores')
                ->onDelete('cascade');

            $table->unique(['id_partida', 'id_jugador']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidas_jugadores');
    }
};
