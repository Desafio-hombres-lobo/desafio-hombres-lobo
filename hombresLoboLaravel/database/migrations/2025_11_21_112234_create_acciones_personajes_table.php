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
        Schema::create('acciones_personajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_personaje')->constrained('personajes')->onDelete('cascade');
            $table->foreignId('id_accion')->constrained('acciones')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acciones_personajes');
    }
};
