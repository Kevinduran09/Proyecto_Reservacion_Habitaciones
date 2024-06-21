<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\AuthController as jwt;
use Illuminate\Support\Facades\Log;
class VerifyToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $jwt = new jwt();
        $token = $request->bearerToken();
        $logged = $jwt->decodeToken($token);
        
        if (is_object($logged)) {
            return response()->json(['data'=>$logged]);
        }
       if ($logged) {
        return $next($request);
       }else{
        return response()->json([
            'message' => 'Autorizacion no valida para acceder a este recurso',
            'status'=>401
        ],401);
       }
    }
}
