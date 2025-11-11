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
        Schema::create('jugadores', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('nickname')->unique();
            $table->foreignId('id_usuario')
                ->constrained('users')
                ->onDelete('cascade')
                ->unique();
            $table->integer('partidas_ganadas')->default(0);
            $table->integer('partidas_perdidas')->default(0);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jugadores');
    }
};
