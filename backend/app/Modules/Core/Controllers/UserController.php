<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Services\UserService;
use App\Modules\Core\Requests\StoreUserRequest;
use App\Modules\Core\Requests\UpdateUserRequest;
use App\Modules\Core\Resources\UserResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class UserController extends Controller
{
    use ApiResponse;

    public function __construct(protected UserService $userService)
    {
    }

    public function index(): JsonResponse
    {
        $users = $this->userService->getAll(request()->all());

        return $this->successResponse(
            UserResource::collection($users)->response()->getData(true),
            'Users retrieved successfully.'
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->store($request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User created successfully.',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $user = $this->userService->show($id);

        return $this->successResponse(
            new UserResource($user),
            'User details retrieved successfully.'
        );
    }

    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $user = $this->userService->update($id, $request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User updated successfully.'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->userService->destroy($id);

        return $this->successResponse(
            null,
            'User deleted successfully.'
        );
    }

    public function getPermissions(string $id): JsonResponse
    {
        $user = $this->userService->show($id);
        return $this->successResponse([
            'direct_permissions' => $user->getPermissionNames(),
            'all_permissions' => $user->getAllPermissions()->pluck('name'),
        ], 'User permissions retrieved successfully.');
    }

    public function syncPermissions(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'permissions' => 'required|array'
        ]);

        $user = $this->userService->syncPermissions($id, $request->permissions);

        return $this->successResponse(
            new UserResource($user),
            'User permissions synced successfully.'
        );
    }
}

