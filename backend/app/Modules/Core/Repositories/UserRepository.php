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
        
        return $user;
    }
}
