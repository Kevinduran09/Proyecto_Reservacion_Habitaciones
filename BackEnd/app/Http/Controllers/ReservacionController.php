<?php

namespace App\Http\Controllers;

use App\Models\Reservacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\AuthController;
class ReservacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservaciones = Reservacion::all();

        if($reservaciones->isEmpty()){
            return response()->json([
                'message'=> 'No se encontro registro de ninguna reservacion en el sistema',
                'status' => 400
            ], 400);
        }

        return response()->json([
            'reservaciones'=> $reservaciones,
            'status'=>200
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->only(['fechaIngreso', 'fechaSalida', 'estado', 'precioTotal', 'usuario_id']), [
            'fechaIngreso' => 'required|date|date_format:d/m/Y',
            'fechaSalida' => 'required|date|date_format:d/m/Y|after_or_equal:fechaIngreso',
            'estado' => 'required',
            'precioTotal' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'usuario_id' => 'exists:Usuario,id',
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
            'precioTotal' => $request->precioTotal,
            'usuario_id' => $request->usuario_id
        ]);

        try {
            $reservacion->habitaciones()->attach($request->habitaciones);
        } catch (\Throwable $th) {
            $reservacion->delete;
            echo 'se elimino';
        }
        return response()->json([
            'message' => 'Reservación creada exitosamente.',
            'reservacion' => $reservacion->load('usuario', 'habitaciones', 'habitaciones.tipoHabitacion'),
            'status' => 201
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $reservacion = Reservacion::find($id);

        if(!$reservacion){
            return response()->json([
                'message'=>"No se encontro ninguna reserva con el id: $id"
            ], 200);
        }

        return response()->json([
            'message' => 'Reservación creada exitosamente.',
            'reservacion' => $reservacion->load('usuario','habitaciones', 'habitaciones.tipoHabitacion'),
            'status' => 201
        ], 201);
    }
    
    /**
     * partial Update the specified resource in storage.
     */
    public function partialUpdate(Request $request, $id)
    {
        $reserva = Reservacion::find($id);


        if (!$reserva) {
            return response()->json([
                'messager' => 'No se encontro la reservacion buscada',
                'status' => 400
            ], 200);
        }

        $validator = Validator::make($request->all(), [
            'fechaIngreso' => '',
            'fechaSalida' => 'after_or_equal:fechaIngreso',
            'estado' => '',
            'precioTotal' => 'numeric|regex:/^\d+(\.\d{1,2})?$/',
            'usuario_id' => 'exists:Usuario,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al realizar la validacion de los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

       $reserva->update($request->only(['fechaIngreso','fechaSalida','estado','precioTotal','usuario_id']));

        return response()->json([
            'message' => 'Se actualizo el registro de la reserva',
            'reserva' => $reserva->load('habitaciones')->load('usuario'),
            'status' => 200
        ], 200);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $reserva = Reservacion::find($id);
        if(!$reserva){
            return response()->json([
                'messager'=>'No se encontro la reservacion buscada',
                'status'=>400
            ], 200);
        }

        $validator = Validator::make($request->all(),[
            'fechaIngreso' => 'required',
            'fechaSalida' => 'required|after_or_equal:fechaIngreso',
            'estado' => 'required',
            'precioTotal' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'usuario_id' => 'required|exists:Usuario,id'
        ]);

        if($validator->fails()){
            return response()->json([
                'message'=>'Error al realizar la validacion de los datos',
                'errors'=>$validator->errors(),
                'status'=>400
            ], 400);
        }
        
        $reserva->fechaIngreso = $request->fechaIngreso;
        $reserva->fechaSalida = $request->fechaSalida;
        $reserva->estado = $request->estado;
        $reserva->precioTotal = $request->precioTotal;
        $reserva->usuario_id = $request->usuario_id;

        $reserva->save();


        return response()->json([
            'message'=>'Se actualizo el registro de la reserva',
            'reserva'=>$reserva->load('habitaciones')->load('usuario'),
            'status'=>200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $reserva = Reservacion::find($id);


        if (!$reserva) {
            return response()->json([
                'messager' => 'No se encontro la reservacion buscada',
                'status' => 400
            ], 200);
        }

        $reserva->delete();

        return response()->json([
            'message'=>"se elimino la reservacion con id: $id",
            'status'=>200
        ], 200);
    }
}
