<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TipoCama;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TipoCamaController extends Controller
{
    public function index()
    {
        $tipoCamas = TipoCama::all();
        return response()->json($tipoCamas, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tipo' => 'required|string|max:255',
            'precioNoche' => 'required|numeric',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $tipoCama = TipoCama::create($request->all());
        return response()->json($tipoCama, 201);
    }

    public function show($id)
    {
        $tipoCama = TipoCama::find($id);
        if (!$tipoCama) {
            return response()->json(['message' => 'Tipo de cama no encontrado'], 404);
        }

        return response()->json($tipoCama, 200);
    }

    public function update(Request $request, $id)
    {
        $tipoCama = TipoCama::find($id);
        if (!$tipoCama) {
            return response()->json(['message' => 'Tipo de cama no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tipo' => 'required|string|max:255',
            'precioNoche' => 'required|numeric',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $tipoCama->update($request->all());
        return response()->json($tipoCama, 200);
    }
    public function partialUpdate(Request $request, $id)
    {
        $tipoCama = TipoCama::find($id);
        if (!$tipoCama) {
            return response()->json(['message' => 'Tipo de cama no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tipo' => 'sometimes|required|string|max:255',
            'precioNoche' => 'sometimes|required|numeric',
            'descripcion' => 'sometimes|nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $tipoCama->update($request->only(['tipo', 'precioNoche', 'descripcion']));
        return response()->json($tipoCama, 200);
    }
    public function destroy($id)
    {
        $tipoCama = TipoCama::find($id);
        if (!$tipoCama) {
            return response()->json(['message' => 'Tipo de cama no encontrado'], 404);
        }

        $tipoCama->delete();
        return response()->json(['message' => 'Tipo de cama eliminado correctamente'], 200);
    }
}
