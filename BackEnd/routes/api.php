<?php

use App\Http\Controllers\ServicioController;
use App\Http\Controllers\TipoCamaController;
use App\Http\Middleware\verfiryAdminRol;
use App\Http\Middleware\VerifyToken;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabitacionController;
use App\Http\Controllers\ReservacionController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\TipoHabitacionController;
use App\Http\Middleware\verifyIdentity;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservacionUsuarioController;



// endopoint para acceso a usuarios publico
Route::middleware([VerifyToken::class])->group(function () {
    Route::post("/users", [UsuarioController::class, 'store'])->middleware(verfiryAdminRol::class);
    Route::get('/users', [UsuarioController::class, 'index'])->middleware(verfiryAdminRol::class);
    Route::post('/habitaciones/filterSearch', [HabitacionController::class, 'findBy']);
    Route::get('/habitacion/{id}', [HabitacionController::class, 'show']);



    
    Route::middleware(VerifyToken::class)->group(function () {
        Route::get('/users/Reservacion', [ReservacionUsuarioController::class, 'index']);
        Route::get('/users/Reservacion/{id}', [ReservacionUsuarioController::class, 'show']);
        Route::post('/users/Reservacion', [ReservacionUsuarioController::class, 'store']);
        Route::post('/users/Reservacion/{id}', [ReservacionUsuarioController::class, 'update']);
        Route::post('/users/Reservacion/{id}', [ReservacionUsuarioController::class, 'partialUpdate']);
        Route::delete('/users/Reservacion/{id}', [ReservacionUsuarioController::class, 'destroy']);
    });

    Route::middleware([verifyIdentity::class])->group(function () {
        Route::get('/users/{id}', [UsuarioController::class, 'show']);
        Route::put('/users/{id}', [UsuarioController::class, 'update']);
        Route::patch('/users/{id}', [UsuarioController::class, 'partialUpdate']);
        Route::delete('/users/{id}', [UsuarioController::class, 'destroy']);
    });
});

Route::middleware([VerifyToken::class, verfiryAdminRol::class])->group(function () {
    Route::patch('tipoCamas/{id}', [TipoCamaController::class, 'partialUpdate']);
    Route::patch('servicio/{id}', [ServicioController::class, 'partialUpdate']);
    Route::post('servicio/{id}', [ServicioController::class, 'update']);
    

    Route::resource('/tipoCama', TipoCamaController::class);
    Route::resource('/servicio', ServicioController::class);
});


Route::resource('/tipoCama', TipoCamaController::class)->middleware([VerifyToken::class, verfiryAdminRol::class]);
Route::resource('/servicio', ServicioController::class)->middleware([VerifyToken::class, verfiryAdminRol::class]);
Route::post('/users/edit/{id}', [UsuarioController::class, 'update'])->middleware([VerifyToken::class, verfiryAdminRol::class]);
Route::post('/users/partial/{id}', [UsuarioController::class, 'partialUpdate'])->middleware([VerifyToken::class, verfiryAdminRol::class]);

Route::get('/habitacion', [HabitacionController::class, 'index']);
// endpoints para el acceso a habitaciones, protegida solo para administradores
Route::middleware([VerifyToken::class, verfiryAdminRol::class])->group(function () {

    //Todas las habitaciones si son publicas para un usuario cualquiera

    Route::post('/habitacion', [HabitacionController::class, 'store']);
    Route::post('/habitacionEdit/{id}', [HabitacionController::class, 'update']);
    Route::post('/habitacionPartialEdit/{id}', [HabitacionController::class, 'partialUpdate']);
    Route::delete('/habitacion/{id}', [HabitacionController::class, 'destroy']);
});
// endpoints para el acceso a tipo de habitaciones, protegida solo para administradores
Route::middleware(verfiryAdminRol::class)->group(function () {
    Route::get('/tipoHabitacion', [TipoHabitacionController::class, 'index'])->withoutMiddleware(verfiryAdminRol::class);
    Route::get('/tipoHabitacion/{id}', [TipoHabitacionController::class, 'show']);
    Route::post('/tipoHabitacion', [TipoHabitacionController::class, 'store']);
    Route::put('/tipoHabitacion/{id}', [TipoHabitacionController::class, 'update']);
    Route::patch('/tipoHabitacion/{id}', [TipoHabitacionController::class, 'partialUpdate']);
    Route::delete('/tipoHabitacion/{id}', [TipoHabitacionController::class, 'destroy']);
    Route::get('/tipoHabitacion/alls', [TipoHabitacionController::class, 'allTypes']);
});

// endpoints para el acceso al reservaciones, protegido por un middleware
Route::middleware([VerifyToken::class, verfiryAdminRol::class])->group(function () {
    Route::get('/reservacion', [ReservacionController::class, 'index']);
    Route::get('/reservacion/{id}', [ReservacionController::class, 'show']);
    Route::post('/reservacion', [ReservacionController::class, 'store']);
    Route::put('/reservacion/{id}', [ReservacionController::class, 'update']);
    Route::patch('/reservacion/{id}', [ReservacionController::class, 'partialUpdate']);
    Route::delete('/reservacion/{id}', [ReservacionController::class, 'destroy']);
});


Route::group(['prefix' => 'auth'], function ($routes) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/me', [AuthController::class, 'me'])->middleware(VerifyToken::class);
    Route::post('/current', [AuthController::class, 'current']);
    Route::post('/userRol', [AuthController::class, 'getRoltoUser']);
});

Route::resource('/rol', RolController::class)->middleware(verfiryAdminRol::class);
Route::patch('/rol', [RolController::class, 'updatePartial'])->middleware(verfiryAdminRol::class);
