<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServicioController extends Controller
{
    public function index()
    {
        $servicios = Servicio::all();
        return response()->json($servicios, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'costo' => 'required|numeric',
            'activo' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $servicio = Servicio::create($request->all());
        return response()->json($servicio, 201); // 201 Created
    }

    public function show($id)
    {
        $servicio = Servicio::find($id);
        if (!$servicio) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        return response()->json($servicio, 200);
    }

    public function update(Request $request, $id)
    {
        $servicio = Servicio::find($id);
        if (!$servicio) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'costo' => 'required|numeric',
            'activo' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $servicio->update($request->all());
        return response()->json($servicio, 200);
    }

    public function partialUpdate(Request $request, $id)
    {
        $servicio = Servicio::find($id);
        if (!$servicio) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'costo' => 'sometimes|required|numeric',
            'activo' => 'sometimes|required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $servicio->update($request->only(['nombre', 'descripcion', 'costo', 'activo']));
        return response()->json($servicio, 200);
    }

    public function destroy($id)
    {
        $servicio = Servicio::find($id);
        if (!$servicio) {
            return response()->json(['message' => 'Servicio no encontrado'], 404);
        }

        $servicio->delete();
        return response()->json(['message' => 'Servicio eliminado correctamente'], 200);
    }
}
