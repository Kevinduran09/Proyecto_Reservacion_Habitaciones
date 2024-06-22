<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habitacion extends Model
{
    use HasFactory;

    protected $table = 'Habitacion';
    protected $hidden = ['pivot', 'created_at', 'updated_at'];
    protected $fillable = [
        'nombre',  // Añadir el campo 'nombre' a la lista de asignables
        'descripcion',  // Añadir el campo 'descripcion' a la lista de asignables
        'disponibilidad',
        'precioNoche',
        'tipo_habitacion_id',
        'tipo_cama_id',
        'url',
        'public_id'
    ];

    public function tipoHabitacion()
    {
        return $this->belongsTo(TipoHabitacion::class);
    }
    public function tipoCama()
    {
        return $this->belongsTo(tipoCama::class);
    }
    public function reservaciones()
    {
        return $this->belongsToMany(Reservacion::class, 'reservacion_habitacion');
    }
    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'servicios_habitacion');
    }
}
