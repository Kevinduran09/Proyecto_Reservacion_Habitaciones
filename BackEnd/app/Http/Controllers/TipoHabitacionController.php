<?php

namespace App\Http\Controllers;

use App\Models\TipoHabitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use function PHPUnit\Framework\isEmpty;

class TipoHabitacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tiposHabitacion = TipoHabitacion::all();

        if ($tiposHabitacion->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron tipos de habitaciones en el sistema',
                'status' => 404
            ], 400);
        }

        return response()->json($tiposHabitacion, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tipoHabitacion' => 'required|unique:TipoHabitacion',
            'capacidad' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $tipoHabitacion = TipoHabitacion::create([
            'tipoHabitacion' => $request->tipoHabitacion,
            'capacidad' => $request->capacidad
        ]);

        $data = ($tipoHabitacion) ? ['tipoHabitacion' => $tipoHabitacion, 'status' => 201] : ['message' => 'Error al crear el registro', 'status' => 500];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tipoHabitacion = TipoHabitacion::find($id);

        if (!$tipoHabitacion) {
            return response()->json([
                'message' => 'Error, No se encontró el tipo de habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        return response()->json([
            'message' => "Se encontró el tipo de habitación con la id: {$id}",
            'tipoHabitacion' => $tipoHabitacion,
            'status' => 200
        ], 200);
    }
    
    /**
     * Partially update the specified resource in storage.
     */
    public function partialUpdate(Request $request, $id)
    {
        $tipoHabitacion = TipoHabitacion::find($id);

        if (!$tipoHabitacion) {
            return response()->json([
                'message' => 'Error, No se encontró el tipo de habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'tipoHabitacion' => '',
            'capacidad' => 'numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $tipoHabitacion->update($request->only(['tipoHabitacion', 'capacidad']));

        return response()->json([
            'message' => 'Se actualizó parcialmente el registro del tipo de habitación',
            'tipo_habitacion' => $tipoHabitacion,
            'status' => 200
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tipoHabitacion = TipoHabitacion::find($id);

        if (!$tipoHabitacion) {
            return response()->json([
                'message' => 'Error, No se encontró el tipo de habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'tipoHabitacion' => 'required|unique:TipoHabitacion,tipoHabitacion,' . $id,
            'capacidad' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $tipoHabitacion->tipoHabitacion = $request->tipoHabitacion;
        $tipoHabitacion->capacidad = $request->capacidad;

        $tipoHabitacion->save();

        return response()->json([
            'message' => 'Se actualizó el registro del tipo de habitación',
            'tipoHabitacion' => $tipoHabitacion,
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tipoHabitacion = TipoHabitacion::find($id);

        if (!$tipoHabitacion) {
            return response()->json([
                'message' => 'Error, No se encontró el tipo de habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        $tipoHabitacion->delete();

        return response()->json([
            'message' => "Se eliminó el tipo de habitación con la id: $id",
            'status' => 200
        ], 200);
    }

    public function allTypes(){
        $types = TipoHabitacion::all();

        if($types.isEmpty()){
            return response()->json([
                'message'=> 'No hay tipos de habitaciones',
                'status'=>400
            ],400);  
        }

        return response()->json([
            'message'=> 'Tipos de habitaciones',
            'data'=>$types,
            'status'=> 200
        ],200);
    }
}
