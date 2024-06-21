<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use app\Http\Controllers\AuthController as JWT;
class verifyIdentity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $jwt = New JWT();
        $token = $request->bearerToken();
        $admin = $jwt->isAdmin($token);

        
        if ($admin) {
            return $next($request);
        }

        $token = $jwt->decodeToken($token, true);
        if ($token->user === (int)$request->route('id')) {
            return $next($request);
        } else {
            return response()->json([
                'message' => 'No tiene acceso a este recurso',
                'status' => 400
            ], 400);
        }

    }
}
