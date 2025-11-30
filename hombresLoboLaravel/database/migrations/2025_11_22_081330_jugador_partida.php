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
        $table->id();

        $table->unsignedBigInteger('jugador_id');
        $table->foreign('jugador_id')->references('id')->on('jugadores')->onDelete('cascade');

        $table->unsignedBigInteger('partida_id');
        $table->foreign('partida_id')->references('id')->on('partidas')->onDelete('cascade');
        $table->boolean('eliminado')->default(false);


        $table->timestamps();


        $table->unique(['jugador_id', 'partida_id']);

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
