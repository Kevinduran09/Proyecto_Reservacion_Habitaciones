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
        Schema::create('reservacion_habitacion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reservacion_id');
            $table->foreign('reservacion_id')->references('id')->on('Reservacion')->onDelete('cascade');

            $table->unsignedBigInteger('habitacion_id');
            $table->foreign('habitacion_id')->references('id')->on('Habitacion')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservacion_habitacion');
    }
};
