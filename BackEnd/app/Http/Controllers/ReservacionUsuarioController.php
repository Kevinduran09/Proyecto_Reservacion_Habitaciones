<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Reservacion;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Validator;
use App\Models\Habitacion;

class ReservacionUsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = AuthController::decodeToken($request->bearerToken(), true);
        if($user){
            $reservaciones = Reservacion::where("usuario_id", $user->user)->get();
            $name = $user->username;
            if ($reservaciones) {
               
                return response()->json([
                    "message" => "Reservaciones del usuario $name",
                    "Reservaciones" => $reservaciones->load('habitaciones')->load('usuario'),
                    'status' => 200
                ], 200);
            } else {
                return response()->json([
                    'message' => "No se encontraron reservaciones para el usuario: $name",
                    "status" => 401,
                ], 401);
            }
        }
        
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = AuthController::decodeToken($request->bearerToken(), true)->user;
        $validator = Validator::make($request->only(['fechaIngreso', 'fechaSalida', 'estado', 'precioTotal']), [
            'fechaIngreso' => 'required|date|date_format:Y-m-d',
            'fechaSalida' => 'required|date|date_format:Y-m-d|after_or_equal:fechaIngreso',
            'estado' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'erros' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        
        $reservacion = Reservacion::create([
            'fechaIngreso' => $request->fechaIngreso,
            'fechaSalida' => $request->fechaSalida,
            'estado' => $request->estado,
            'precioTotal'=>0,
            'usuario_id' => $user
        ]);
        $habitaciones = json_decode($request->habitaciones);
        $result = $this->validateStateHabitaciones($habitaciones);

        if($result['bool']){
            try {
                $reservacion->habitaciones()->attach($habitaciones);
                foreach ($reservacion->habitaciones as $habitacion) {
                  $precioReservacion =  $reservacion->precioTotal += $habitacion->precioNoche;
                }
                $this->updateStateHabitaciones($reservacion->habitaciones, 'Ocupada');
                $reservacion->update(['PrecioTotal'=> $precioReservacion]);
            } catch (\Throwable $th) {
                echo $th;
            }
            return response()->json([
                'message' => 'Reservación creada exitosamente.',
                'reservacion' => $reservacion->load('usuario', 'habitaciones', 'habitaciones.tipoHabitacion'),
                'status' => 201
            ], 201);
        }else{
            $reservacion->delete();
            return response()->json([
                'message'=> 'No se pudo crear la reservacion porque hay habitaciones no disponibles',
                'habitaciones no disponibles'=> Habitacion::findMany($result['habitaciones']),
                'status'=> 400
            ],400);
        }
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,$id)
    {
        $user = AuthController::decodeToken($request->bearerToken(), true)->user;
        $reservacion = Reservacion::find($id);
        if ($reservacion && $user == $reservacion->usuario_id) {
            return response()->json([
                "message" => "Reservacion del usuario $user",
                "Reservaciones" => $reservacion,
                'status' => 200
            ], 200);
        }else{
            return response()->json([
                'message'=> 'No tiene autorizacion para acceder a esta reservacion',
                'status'=> 400
            ],400);
        }
    }

    public function partialUpdate(Request $request, $id)
    {
        $user = AuthController::decodeToken($request->bearerToken(), true)->user;
        $reservacion = Reservacion::find($id);

        if(($reservacion && $user == $reservacion->usuario_id)){
            $validator = Validator::make($request->all(), [
                'fechaIngreso' => '',
                'fechaSalida' => 'after_or_equal:fechaIngreso',
                'estado' => '',
                'precioTotal' => 'numeric|regex:/^\d+(\.\d{1,2})?$/'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error al realizar la validacion de los datos',
                    'errors' => $validator->errors(),
                    'status' => 400
                ], 400);
            }

            $reservacion->update($request->only(['fechaIngreso', 'fechaSalida', 'estado', 'precioTotal']));

            return response()->json([
                'message' => 'Se actualizo el registro de la reserva',
                'reserva' => $reservacion->load('habitaciones')->load('usuario'),
                'status' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'No tiene autorizacion para acceder a esta reservacion',
                'status' => 400
            ], 400);
        }
        
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = AuthController::decodeToken($request->bearerToken(), true)->user;
        $reservacion = Reservacion::find($id);
        if (!$reservacion) {
            return response()->json([
                'messager' => 'No se encontro la reservacion buscada',
                'status' => 400
            ], 200);
        }
        if($reservacion && $user == $reservacion->usuario_id) {
            $validator = Validator::make($request->all(), [
                'fechaIngreso' => 'required',
                'fechaSalida' => 'required|after_or_equal:fechaIngreso',
                'estado' => 'required',
                'precioTotal' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
                'usuario_id' => 'required|exists:Usuario,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error al realizar la validacion de los datos',
                    'errors' => $validator->errors(),
                    'status' => 400
                ], 400);
            }

            $reservacion->fechaIngreso = $request->fechaIngreso;
            $reservacion->fechaSalida = $request->fechaSalida;
            $reservacion->estado = $request->estado;
            $reservacion->precioTotal = $request->precioTotal;

            $reservacion->save();


            return response()->json([
                'message' => 'Se actualizo el registro de la reserva',
                'reserva' => $reservacion->load('habitaciones')->load('usuario'),
                'status' => 200
            ], 200);
        }else{
            return response()->json([
                'message' => 'No tiene autorizacion para acceder a esta reservacion',
                'status' => 400
            ], 400);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,$id)
    {

        $user = AuthController::decodeToken($request->bearerToken(), true)->user;
        $reservacion = Reservacion::find($id);
        if (!$reservacion) {
            return response()->json([
                'messager' => 'No se encontro la reservacion buscada compai',
                'status' => 400
            ], 200);
        }
        if($reservacion && $user == $reservacion->usuario_id){
           $habitaciones = $reservacion->habitaciones;
           $this->updateStateHabitaciones($habitaciones,'Disponible');
            $reservacion->delete();

            return response()->json([
                'message' => "se elimino la reservacion",
                'status' => 200
            ], 200);
        }else{
            return response()->json([
                'message' => 'No tiene autorizacion para acceder a esta reservacion',
                'status' => 400
            ], 400);
        }
    }
    public function updateStateHabitaciones($habitaciones,$estado){
       foreach($habitaciones as $habi){
        $habitacion = Habitacion::where('id',$habi->id)->first();
        $habitacion->disponibilidad = $estado;
        $habitacion->save();
       }
       
    }
    public function validateStateHabitaciones($habitaciones){
        $flag = true;
        $ids = array();
        foreach($habitaciones as $habi){
            $habitacion = Habitacion::where('id',$habi)->first();
            if($habitacion->disponibilidad != "Disponible"){
                array_push($ids,$habitacion->id);
                $flag = false;
            }
        }
        if(!$flag){
            return [
                "message"=> "Habitaciones no disponibles",
                "habitaciones"=>$ids,
                'bool'=> $flag
            ];
        }else{
            return [
                "message"=> "Habitaciones disponibles",
                "habitaciones"=>$ids,
                'bool'=> $flag
            ];
        }
    }

}
