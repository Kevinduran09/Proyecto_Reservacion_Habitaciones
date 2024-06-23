<?php

namespace App\Http\Controllers;

use App\Models\Habitacion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Cloudinary\Api\Upload\UploadApiResponse;
use Illuminate\Support\Facades\DB;
class HabitacionController extends Controller
{

    public function index()
    {
        $habitaciones = Habitacion::with('tipoHabitacion','tipoCama')->get();

        if ($habitaciones->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron registros de habitaciones en el sistema',
                'status' => 404
            ], 200);
        }

        return response()->json($habitaciones->load('servicios'), 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'disponibilidad' => 'required',
            'precioNoche' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'tipo_habitacion_id' => 'required|exists:TipoHabitacion,id',
            'tipo_cama_id' => 'required|exists:TipoCama,id',
            'imagen' => 'required|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $file = request()->file('imagen');
        $infoImage = $this->saveImage($file);
        $habitacion = Habitacion::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'disponibilidad' => $request->disponibilidad,
            'precioNoche' => $request->precioNoche,
            'tipo_habitacion_id' => $request->tipo_habitacion_id,
            'tipo_cama_id' => $request->tipo_cama_id,
            'url' => $infoImage["url"],
            'public_id' => $infoImage["public_id"]
        ]);

        return response()->json([
            'message' => 'Habitación creada exitosamente',
            'habitacion' => $habitacion->load('tipoHabitacion', 'tipoCama','servicios'),
            'status' => 201
        ], 201);
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
            'habitacion' => $habitacion->load(['tipoHabitacion','tipoCama','servicios']),
            'status' => 200
        ], 200);
    }
    public function findBy(Request $request){
        $validator = Validator::make($request->all(), [
            'dateStart' => 'required|date',
            'dateEnd' => 'required|date|after:dateStart',
            'typeRoom' => 'nullable|exists:tipohabitacion,id',
            'minValue' => 'numeric|min:0',
            'maxValue' => 'numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $dateStart = $request->input('dateStart');
        $dateEnd = $request->input('dateEnd');
        $typeRoom = $request->input('typeRoom');
        $minValue = $request->input('minValue');
        $maxValue = $request->input('maxValue');

        // Consulta de habitaciones
        $rooms = Habitacion::with(['tipoHabitacion','tipoCama','servicios'])
        ->leftJoin('reservacion_habitacion', 'habitacion.id', '=', 'reservacion_habitacion.habitacion_id')
        ->leftJoin('reservacion', 'reservacion_habitacion.reservacion_id', '=', 'reservacion.id')
        ->where(function ($query) use ($dateStart, $dateEnd) {
            $query->whereNull('reservacion.fechaIngreso')
            ->orWhere(function ($query) use ($dateStart, $dateEnd) {
                $query->where('reservacion.fechaIngreso', '>', $dateEnd)
                    ->orWhere('reservacion.fechaSalida', '<', $dateStart);
            });
        })
            ->where('habitacion.precioNoche', '>=', $minValue)
            ->where('habitacion.precioNoche', '<=', $maxValue)
            ->where('habitacion.disponibilidad','Disponible');

        if (!is_null($typeRoom)) {
            $rooms = $rooms->where('habitacion.tipo_habitacion_id', $typeRoom);
        }

        $rooms = $rooms->select('habitacion.*')->get();

        return response()->json($rooms,200);
    }
    /**
     * Partially update the specified resource in storage.
     */
    public function partialUpdate(Request $request, $id)
    {
        $user = Usuario::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado.',
                'status' => 404
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'cedula' => 'sometimes|required|unique:Usuario,cedula,' . $id,
            'nombre' => 'sometimes|required|string',
            'apellidos' => 'sometimes|required|string',
            'correo' => 'sometimes|required|email|unique:Usuario,correo,' . $id,
            'nomUsuario' => 'sometimes|required|unique:Usuario,nomUsuario,' . $id,
            'contrasena' => 'sometimes|required',
            'rol_id' => 'sometimes|required|numeric|exists:rol,id',
            'imagen' => 'sometimes|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        // Manejar la carga de una nueva imagen, si se proporciona
        if ($request->hasFile('imagen')) {
            if ($user->public_id) {
                $this->deleteImage($user->public_id);  // Elimina la imagen anterior de Cloudinary
            }
            $infoImage = $this->saveImage($request->file('imagen')); // Sube la nueva imagen
            $user->url = $infoImage["url"];
            $user->public_id = $infoImage["public_id"];
        }

        // Actualizar los campos proporcionados
        $input = $request->only(['cedula', 'nombre', 'apellidos', 'correo', 'nomUsuario', 'rol_id']);
        if ($request->filled('contrasena')) {
            $input['contrasena'] = hash("sha256", $request->contrasena);
        }
        $user->update($input);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente.',
            'usuario' => $user->load('rol'),
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
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'disponibilidad' => 'required',
            'precioNoche' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'tipo_habitacion_id' => 'required|exists:TipoHabitacion,id',
            'tipo_cama_id' => 'required|exists:TipoCama,id',
            'imagen' => 'required|image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        if($request->public_id){
            $this->deleteImage($habitacion->public_id);
        }
        if ($request->hasFile('imagen')) {

            
            $infoImage = $this->saveImage($request->file('imagen'));
            $habitacion->url = $infoImage["url"];
            $habitacion->public_id = $infoImage["public_id"];
        }

        $habitacion->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'disponibilidad' => $request->disponibilidad,
            'precioNoche' => $request->precioNoche,
            'tipo_habitacion_id' => $request->tipo_habitacion_id,
            'tipo_cama_id' => $request->tipo_cama_id
        ]);

        return response()->json([
            'message' => 'Habitación actualizada exitosamente',
            'habitacion' => $habitacion->load('tipoHabitacion', 'tipoCama'),
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
