<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Core\Resources\UserResource;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuthService $authService)
    {
    }

    /**
     * Handle user login.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return $this->successResponse(
            $result,
            'Login successful.'
        );
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->successResponse(
            null,
            'Logged out successfully.'
        );
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load(['company', 'branch']);
        
        return $this->successResponse(
            new UserResource($user),
            'User profile retrieved successfully.'
        );
    }
}
