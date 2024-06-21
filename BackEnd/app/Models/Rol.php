<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;
    protected $table = 'Rol';
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'tipoRol'
    ] ;
    
    public function usuario(){
        return $this->hasMany(Usuario::class);
    }
}
