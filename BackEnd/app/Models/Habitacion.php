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
        'disponibilidad',
        'precioNoche',
        'tipo_habitacion_id',
        'url',
        'public_id',
    ];

    public function tipoHabitacion(){
        return $this->belongsTo(TipoHabitacion::class);
    }
    public function reservaciones()
    {
        return $this->belongsToMany(Reservacion::class, 'reservacion_habitacion');
    }

}
