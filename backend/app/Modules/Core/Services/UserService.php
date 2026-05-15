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

    public function getAll(): Collection
    {
        return $this->userRepository->all();
    }

    public function store(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
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
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return DB::transaction(function () use ($id, $data) {
            $this->userRepository->update($id, $data);
            return $this->userRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->userRepository->delete($id);
        });
    }
}
