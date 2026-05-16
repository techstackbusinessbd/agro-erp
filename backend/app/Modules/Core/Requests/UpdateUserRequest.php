<?php

namespace App\Modules\Core\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'company_id' => ['sometimes', 'nullable', 'uuid', 'exists:companies,id'],
            'branch_id'  => ['sometimes', 'nullable', 'uuid', 'exists:branches,id'],
            'name'       => ['sometimes', 'required', 'string', 'max:255'],
            'username'   => ['sometimes', 'required', 'string', 'max:100', Rule::unique('users')->ignore($userId)],
            'email'      => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($userId)],
            'phone'      => ['nullable', 'string', 'max:20'],
            'password'   => ['nullable', 'string', 'min:8', 'confirmed'],
            'role'       => ['sometimes', 'required', 'string', 'exists:roles,name'],
            'is_active'  => ['boolean'],
        ];
    }
}
