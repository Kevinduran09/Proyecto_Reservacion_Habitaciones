<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Usuario;
use Firebase\JWT\JWT;
use Carbon\Carbon;
use Firebase\JWT\Key;
use UnexpectedValueException;
use App\Models\Rol;
use Illuminate\Support\Facades\Log;
class AuthController extends Controller
{


    public function login(Request $request)
    {
        $credentials = $request->only(['nomUsuario', 'contrasena']);

        $validator = Validator::make($credentials, [
            'nomUsuario' => 'required|string',
            'contrasena' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        if (!$user = $this->validateUser($credentials)) {
            return response()->json([
                'error' => 'Datos de ingreso incorrectos',
                'status'=>401
            ], 401);
        }

        return $this->createToken($user);
    }
    public function current(Request $request){
        $status = $this->decodeToken($request->bearerToken());

        if ($status) {
            return response()->json([
                'status'=>true
            ],200);
        }else{
            return response()->json([
                'status'=>false
            ],200);
        }

    }
    public function getRoltoUser(Request $request){
        Log::info('message');
        $token = $request->bearerToken();
       
        $user = $this->decodeToken($token,true);
       
        if ($user) {
            return response()->json([
                'rol'=> $user->rol,
                'status'=>200
            ],200);
        }else{
            return response()->json([
                'status'=>400
            ],200);
        }
    }
    public function register(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'cedula' => 'required|min:9|unique:Usuario',
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'correo' => 'required|email|unique:Usuario',
            'nomUsuario' => 'required|unique:Usuario',
            'contrasena' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error al validar los datos',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $rol = Rol::where('tipoRol', 'usuario')->first();
        $user = Usuario::create([
            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'correo' => $request->correo,
            'nomUsuario' => $request->nomUsuario,
            'contrasena' => hash("sha256", $request->contrasena),
            "rol_id" => $rol->id
        ]);

        return response()->json($user);
    }

    public function me(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json([
                'message' => "token no encontrado",
                'status' => 404
            ], 404);
        }
        return response()->json($this->decodeToken($token, true));
    }
    public static function decodeToken($token, $getId = false)
    {
        if (!$token) {
            return false;
        }

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            if (!is_object($decoded) && !isset($decoded->user)) {
                throw new UnexpectedValueException('El token decodificado no es un objeto válido');
            }

            return $getId ? $decoded : true;
        } catch (\Throwable $e) {
            return false;
        }
    }
    public function validateUser(array $credentials)
    {
        if ($user = Usuario::where('nomUsuario', $credentials['nomUsuario'])->where('contrasena', hash('sha256', $credentials['contrasena']))->first()) {
            return $user->id;
        } else {
            return false;
        }
    }
    public function createToken($user)
    {
        $user = Usuario::find($user)->load('rol');

        $token = JWT::encode([
            'user' => $user->id,
            'username' => $user->nomUsuario,
            'rol' => $user->rol->tipoRol,
            'exp' => Carbon::now()->addMinutes(240)->timestamp
        ], env('JWT_SECRET'), 'HS256');

        return response()->json(compact('token'));
    }
    public function isAdmin($token)
    {
        $user = $this->decodeToken($token, true);
        
        return (is_object($user) && $user->rol == 'admin') ? true : false;
    }
}
