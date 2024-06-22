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
        Schema::create('Habitacion', function (Blueprint $table) {
            $table->id();

            $table->string('nombre'); // Campo para el nombre de la habitación
            $table->text('descripcion')->nullable(); // Campo para la descripción de la habitación, opcional
            $table->string('disponibilidad');
            $table->float('precioNoche');
            $table->string('url');
            $table->string('public_id');
            $table->unsignedBigInteger('tipo_habitacion_id');
            $table->unsignedBigInteger('tipo_cama_id');

            // Claves foráneas
            $table->foreign('tipo_cama_id')
                ->references('id')
                ->on('TipoCama')
                ->onDelete('cascade');
            $table->foreign('tipo_habitacion_id')
                ->references('id')
                ->on('TipoHabitacion')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Habitacion');
    }
};
