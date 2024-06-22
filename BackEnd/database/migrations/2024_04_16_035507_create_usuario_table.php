<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Usuario', function (Blueprint $table) {
            $table->id();
            $table->string('cedula')->unique()->ond;
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('correo')->unique();
            $table->string('nomUsuario')->unique();
            $table->string('contrasena');
            $table->string('url')->nullable();
            $table->string('public_id')->nullable();
            $table->unsignedBigInteger('rol_id');
            $table->foreign('rol_id')->references('id')->on('Rol')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });

        DB::table('Usuario')->insert([
            'cedula'=> '000000000',
            'nombre'=> 'admin',
            'apellidos'=> 'admin',
            'correo'=> 'admin@gmail.com',
            'nomUsuario'=> 'admin',
            'contrasena'=> hash("sha256",'admin'),
            'rol_id'=> 1,
        ]);
        DB::table('Usuario')->insert([
            'cedula' => '5044000535',
            'nombre' => 'kevin',
            'apellidos' => 'duran martinez',
            'correo' => 'kvdm@gmail.com',
            'nomUsuario' => 'kvdm09',
            'contrasena' => hash("sha256", '091001'),
            'rol_id' => 2,
        ]);

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
