<?php

namespace App\Http\Controllers;

use App\Models\Reservacion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Cloudinary\Api\Upload\UploadApiResponse;

class UsuarioController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = Usuario::all();

        if($users->isEmpty()){
            return response()->json([
                'message'=>'No se encontraron usuarios en el sistema',
                'status'=> 404
            ],200);
        }
        return response()->json($users->load('rol'),200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'cedula' => 'required|min:9|max:9|unique:Usuario',
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'correo' => 'required|email|unique:Usuario',
            'nomUsuario' => 'required|unique:Usuario',
            'contrasena' => 'required',
            'rol_id' => 'required|exists:rol,id',
            'imagen' => 'required|image|mimes:jpg,png,jpeg' // Validar la imagen
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $file = $request->file('imagen');
        $infoImage = $this->saveImage($file); // Guardar imagen y obtener información

        $user = Usuario::create([

            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'correo' => $request->correo,
            'nomUsuario' => $request->nomUsuario,
            'contrasena' => hash("sha256", $request->contrasena),
            'rol_id' => $request->rol_id,
            'url' => $infoImage["url"], // Guardar URL de la imagen
            'public_id' => $infoImage["public_id"] // Guardar public_id de Cloudinary
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'usuario' => $user->load('rol'),
            'status' => 201
        ],
            201
        );
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Usuario::find($id);
        
        if(!$user){
            return response()->json([
                'message' => 'Error, No se encontro al usuaro que se esta buscando',
                'status' => 400
            ], 400);
        }

        return response()->json([
            'message'=> "Se encontro al usuario con la id: {$id}",
            'User'=> $user->setHidden(['created_at', 'updated_at'])->load('rol'),
            'status'=>200
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function partialUpdate(Request $request,$id)
    {
        $user = Usuario::find($id);

        // Validar si el usuario existe 
        if (!$user) {
            return response()->json([
                'message' => 'Error, No se encontro al usuaro que se esta buscando',
                'status' => 400
            ], 400);
        }
        // validar que vengan todos los atributos requeridos en la request
        $validator = Validator::make($request->all(), [
            'cedula' => 'unique:Usuario|min:9',
            'nombre' => '',
            'apellidos' => '',
            'correo' => 'email|unique:Usuario',
            'nomUsuario' => 'unique:Usuario',
            'contrasena' => '',
            'rol_id'=>''
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        echo $request->nombre;
        $user->update($request->only(['cedula','nombre','apellidos','correo','nomUsuario','contraseña','rol_id']));
    

        return response()->json([
            'message' => 'Se actualizo el registro del usuario',
            'user' => $user->load('rol'),
            'status' => 200
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Usuario::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Error, No se encontró el usuario',
                'status' => 400
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required',
            'apellidos' => 'required',
            'correo' => 'required|email|unique:Usuario,correo,' . $id,
            'nomUsuario' => 'required|unique:Usuario,nomUsuario,' . $id,
            'contrasena' => 'required',
            'rol_id' => 'required|numeric|exists:rol,id',
            'imagen' => 'image|mimes:jpg,png,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        if ($request->hasFile('imagen')) {
            if ($user->public_id) {
                $this->deleteImage($user->public_id); // Eliminar imagen anterior
            }
            $infoImage = $this->saveImage($request->file('imagen')); // Subir nueva imagen
            $user->url = $infoImage["url"];
            $user->public_id = $infoImage["public_id"];
        }

        $user->update($request->only(['nombre', 'apellidos', 'correo', 'nomUsuario', 'contrasena', 'rol_id']));

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'usuario' => $user->load('rol'),
            'status' => 200
        ],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Usuario::find($id);

        if (!$user) {
            return response()->json([
                'message' => "Error, No se encontro al usuaro que se esta buscando $id",
                'status' => 400
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => "Se elimino al usuario con la id: $id",
            'status' => 200
        ], 200);
    }
    public function deleteImage($public_id)
    {
        Cloudinary::destroy($public_id);
    }
    public function saveImage($image)
    {
        $uploadedImage = Cloudinary::upload($image->getRealPath(), ['folder' => 'usuarios']);
        $url = $uploadedImage->getSecurePath();  //esta es la linea 75
        $public_id = $uploadedImage->getPublicId();
        return [
            'url' => $url,
            'public_id' => $public_id,
        ];
    }
}
