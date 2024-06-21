<?php

namespace App\Http\Controllers;

use App\Models\Habitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Cloudinary\Api\Upload\UploadApiResponse;

class HabitacionController extends Controller
{

    public function index()
    {
        $habitaciones = Habitacion::with('tipoHabitacion')->get();

        if ($habitaciones->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron registros de habitaciones en el sistema',
                'status' => 404
            ], 200);
        }

        return response()->json($habitaciones, 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'disponibilidad' => 'required',
            'precioNoche' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'tipo_habitacion_id' => 'required|exists:tipoHabitacion,id',
            'imagen'=>'required|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $file = request()->file('imagen');
        $infoImage = $this->saveImage( $file);
        $habitacion = Habitacion::create([
            'disponibilidad' => $request->disponibilidad,
            'precioNoche' => $request->precioNoche,
            'tipo_habitacion_id' => $request->tipo_habitacion_id,
            'url'=> $infoImage["url"],
            'public_id'=> $infoImage["public_id"]
        ]);

        $data = ($habitacion) ? ['habitacion' => $habitacion->load('tipoHabitacion'), 'status' => 201] : ['message' => 'Error al crear el registro de habitacion', 'status' => 500];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $habitacion = Habitacion::find($id);

        if (!$habitacion) {
            return response()->json([
                'message' => 'Error, No se encontró la habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        return response()->json([
            'message' => "Se encontró la habitación con la id: {$id}",
            'habitacion' => $habitacion->load('tipoHabitacion'),
            'status' => 200
        ], 200);
    }

    /**
     * Partially update the specified resource in storage.
     */
    public function partialUpdate(Request $request, $id)
    {
        $habitacion = Habitacion::find($id);

        if (!$habitacion) {
            return response()->json([
                'message' => 'Error, No se encontró la habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'disponibilidad' => '',
            'precioNoche' => 'numeric|regex:/^\d+(\.\d{1,2})?$/',
            'tipo_habitacion_id' => 'exists:tipoHabitacion,id',
            'imagen' => 'image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        if($request->hasFile('imagen')) {
            $public_id = $habitacion->public_id;
            $this->deleteImage($public_id);
            $file = request()->file('imagen');
            $infoImage = $this->saveImage($file);
            $habitacion->public_id = $infoImage["public_id"];
            $habitacion->url = $infoImage["url"];
            $habitacion->save();
        }

        $habitacion->update($request->only(['disponibilidad', 'precioNoche', 'tipo_habitacion_id']));
        return response()->json([
            'message' => 'Se actualizó parcialmente el registro de la habitación',
            'habitacion' => $habitacion->load('tipoHabitacion'),
            'status' => 200
        ], 200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $habitacion = Habitacion::find($id);

        if (!$habitacion) {
            return response()->json([
                'message' => 'Error, No se encontró la habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'disponibilidad' => 'required',
            'precioNoche' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'tipo_habitacion_id' => 'required|exists:tipoHabitacion,id',
            'imagen' => 'required|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
            $public_id = $habitacion->public_id;
            $this->deleteImage($public_id);
            $file = request()->file('imagen');
            $infoImagen = $this->saveImage($file);


        $habitacion->disponibilidad = $request->disponibilidad;
        $habitacion->precioNoche = $request->precioNoche;
        $habitacion->tipo_habitacion_id = $request->tipo_habitacion_id;
        $habitacion->url = $infoImagen["url"];
        $habitacion->public_id = $infoImagen["public_id"];
        $habitacion->save();

        return response()->json([
            'message' => 'Se actualizó el registro de la habitación',
            'habitacion' => $habitacion->load('tipoHabitacion'),
            'status' => 200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $habitacion = Habitacion::find($id);

        if (!$habitacion) {
            return response()->json([
                'message' => 'Error, No se encontró la habitación que se está buscando',
                'status' => 400
            ], 400);
        }

        $habitacion->delete();

        return response()->json([
            'message' => "Se eliminó la habitación con la id: $id",
            'status' => 200
        ], 200);
    }


    public function deleteImage($public_id){
        Cloudinary::destroy($public_id);
    }
    public function saveImage($image){
        $uploadedImage = Cloudinary::upload($image->getRealPath(), ['folder' => 'habitaciones']);
        $url = $uploadedImage->getSecurePath();  //esta es la linea 75
        $public_id = $uploadedImage->getPublicId();
        return [
            'url'=> $url,
            'public_id'=> $public_id,
        ];
    }
}
