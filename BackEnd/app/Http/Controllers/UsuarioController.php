<?php

namespace App\Http\Controllers;

use App\Models\Reservacion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


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
        $validator = Validator::make($request->all(),[
            'cedula'=>'required|min:9|max:9|unique:Usuario',
            'nombre'=>'required|string',
            'apellidos'=>'required|string',
            'correo'=>'required|email|unique:Usuario',
            'nomUsuario'=>'required|unique:Usuario',
            'contraseña'=>'required',
            'rol_id'=> 'required|exists:rol,id',
        ]);


        if($validator->fails()){
            return response()->json([
                'message'=>'Erro al validar los datos',
                'errors'=>$validator->errors(),
                'status'=>400
            ],400);
        }

        $user = Usuario::create([
            'cedula'=>$request->cedula,
            'nombre'=>$request->nombre,
            'apellidos'=>$request->apellidos,
            'correo'=>$request->correo, 
            'nomUsuario'=>$request->nomUsuario,
            'contraseña'=> hash("sha256",$request->contraseña),
            "rol_id"=> (int)$request->rol_id,
        ]);

        $data = ($user) ? ['usuario'=>$user->load('rol'),'status'=>201] : ['message'=>'Error al crear el registro','status'=>500];

        return response()->json($data, 200);
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
            'contraseña' => '',
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

        // Validar si el usuario existe 
        if (!$user) {
            return response()->json([
                'message' => 'Error, No se encontro al usuaro que se esta buscando',
                'status' => 400
            ], 400);
        }
        // validar que vengan todos los atributos requeridos en la request
        $validator = Validator::make($request->all(), [
            'cedula' => 'required|unique:Usuario|min:9',
            'nombre' => 'required',
            'apellidos' => 'required',
            'correo' => 'required|email|unique:Usuario',
            'nomUsuario' => 'required|unique:Usuario',
            'contraseña' => 'required',
            'rol_id'=> 'required|numeric|exists:rol,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $user->cedula = $request->cedula;
        $user->nombre = $request->nombre;
        $user->apellidos = $request->apellidos;
        $user->correo = $request->correo;
        $user->nomUsuario = $request->nomUsuario;
        $user->contraseña = $request->contraseña;

        $user->save();

        return response()->json([
            'message'=>'Se actualizo el registro del usuario',
            'user'=> $user->load('rol'),
            'status'=>200
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Usuario::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Error, No se encontro al usuaro que se esta buscando',
                'status' => 400
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => "Se elimino al usuario con la id: $id",
            'status' => 200
        ], 200);
    }
    
}
