<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Authenticate user and generate Sanctum token
     */
    public function login(array $credentials): array
    {
        $login = $credentials['login'];
        $user = User::where('email', $login)->orWhere('username', $login)->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'login' => ['This account is deactivated.'],
            ]);
        }

        // Log the user in to the web session for Sanctum SPA
        \Illuminate\Support\Facades\Auth::guard('web')->login($user);

        // Optional: Generate Sanctum Token if you need API tokens for external apps
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    /**
     * Logout user by clearing session and revoking token
     */
    public function logout(User $user): void
    {
        if ($user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        \Illuminate\Support\Facades\Auth::guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
