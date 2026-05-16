<?php

namespace App\Modules\Core\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'company_id' => $this->company_id,
            'company'    => new CompanyResource($this->whenLoaded('company')),
            'branch_id'  => $this->branch_id,
            'branch'     => new BranchResource($this->whenLoaded('branch')),
            'name'       => $this->name,
            'username'   => $this->username,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'role'       => $this->getRoleNames()->first() ?? $this->role,
            'roles'      => $this->getRoleNames(),
            'all_permissions' => $this->getAllPermissions()->pluck('name'),
            'is_active'  => (bool) $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
