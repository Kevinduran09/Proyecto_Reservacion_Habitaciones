<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Rol;
class Usuario extends Model
{
    use HasFactory;

    protected $table = 'Usuario';
    protected $hidden = ['created_at', 'updated_at'];
    // campos que se pueden manipular
    protected $fillable = [
        'cedula',
        'nombre',
        'apellidos',
        'correo',
        'nomUsuario',
        'contrasena',
        'rol_id'
    ];


    public function reservacion()
    {
        return $this->belongsTo(Reservacion::class);
    }
    public function rol(){
        return $this->belongsTo(rol::class);
    }
}
