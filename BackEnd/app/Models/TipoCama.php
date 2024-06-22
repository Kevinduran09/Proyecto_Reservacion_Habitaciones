<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCama extends Model
{
    use HasFactory;
    protected $table = 'TipoCama';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'tipo',
        'precioNoche',
        'descripcion'
    ];
    public function habitaciones()
    {
        return $this->hasMany(Habitacion::class);
    }
}
