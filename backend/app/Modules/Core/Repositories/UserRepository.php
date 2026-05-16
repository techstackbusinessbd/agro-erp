<?php

namespace App\Modules\Core\Repositories;

use App\Models\User;
use App\Modules\Core\Interfaces\UserRepositoryInterface;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?User
    {
        /** @var User|null $user */
        $user = parent::find($id);
        
        return $user;
    }

    public function create(array $data): User
    {
        /** @var User $user */
        $user = parent::create($data);
        
        if (isset($data['role'])) {
            $user->assignRole($data['role']);
        }
        
        return $user;
    }

    public function update(string $id, array $data): bool
    {
        /** @var User $user */
        $user = $this->model->findOrFail($id);
        $updated = $user->update($data);
        
        if ($updated && isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }
        
        return $updated;
    }

    public function paginate(int $perPage = 10, ?string $search = null)
    {
        $query = $this->model->newQuery();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }
        
        return $query->latest()->paginate($perPage);
    }
}
