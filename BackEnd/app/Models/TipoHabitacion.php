<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoHabitacion extends Model
{
    use HasFactory;


    protected $table = 'TipoHabitacion';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'tipoHabitacion',
        'capacidad'
    ];

    public function habitacion(){
        return $this->hasMany(Habitacion::class);
    }
}
