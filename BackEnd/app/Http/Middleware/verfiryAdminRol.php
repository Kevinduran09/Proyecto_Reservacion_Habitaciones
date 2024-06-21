<?php

namespace App\Http\Middleware;

use App\Http\Controllers\AuthController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class verfiryAdminRol
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $jwt = new AuthController();
        $token = $request->bearerToken();
        $token = $jwt->isAdmin($token);
        if (!$token) {
            return response()->json([
                'message'=>'Autorizacion denegada, solo administradores tienen acceso',
                'status' => 401
            ],401);
        }
        return $next($request);
    }
}
