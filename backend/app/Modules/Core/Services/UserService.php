<?php

namespace App\Modules\Core\Services;

use App\Models\User;
use App\Modules\Core\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(protected UserRepositoryInterface $userRepository)
    {
    }

    public function getAll(array $params = [])
    {
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? null;
        return $this->userRepository->paginate($perPage, $search);
    }

    public function store(array $data): User
    {
        if (isset($data['role']) && $data['role'] === 'Super Admin') {
            abort(403, 'Cannot create another Super Admin user.');
        }

        return DB::transaction(function () use ($data) {
            return $this->userRepository->create($data);
        });
    }

    public function show(string $id): User
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            abort(404, 'User not found');
        }
        return $user;
    }

    public function update(string $id, array $data): User
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            abort(404, 'User not found');
        }

        // Prevent modification of system superadmin
        if ($user->username === 'superadmin') {
            // Allow update if it's not changing vital fields, but usually better to block all for simplicity
            // or just block status/role/username changes.
            // For now, let's block everything for superadmin to follow "cannot be edited/deleted/disabled"
            abort(403, 'System Super Admin cannot be modified.');
        }

        // Remove password from data if it's empty to avoid overwriting with null
        if (empty($data['password'])) {
            unset($data['password']);
        }

        if (isset($data['role']) && $data['role'] === 'Super Admin' && $user->username !== 'superadmin') {
            abort(403, 'Cannot assign Super Admin role to this user.');
        }

        return DB::transaction(function () use ($id, $data) {
            $this->userRepository->update($id, $data);
            return $this->userRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        $user = $this->userRepository->find($id);
        if ($user && $user->username === 'superadmin') {
            abort(403, 'System Super Admin cannot be deleted.');
        }

        return DB::transaction(function () use ($id) {
            return $this->userRepository->delete($id);
        });
    }

    public function syncPermissions(string $id, array $permissions): User
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            abort(404, 'User not found');
        }

        return DB::transaction(function () use ($user, $permissions) {
            $user->syncPermissions($permissions);
            return $user;
        });
    }
}
