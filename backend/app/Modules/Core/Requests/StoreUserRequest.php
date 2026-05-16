<?php

namespace App\Modules\Core\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['nullable', 'uuid', 'exists:companies,id'],
            'branch_id'  => ['nullable', 'uuid', 'exists:branches,id'],
            'name'       => ['required', 'string', 'max:255'],
            'username'   => ['required', 'string', 'max:100', 'unique:users,username'],
            'email'      => ['required', 'email', 'unique:users,email'],
            'phone'      => ['nullable', 'string', 'max:20'],
            'password'   => ['required', 'string', 'min:8', 'confirmed'],
            'role'       => ['required', 'string', 'exists:roles,name'],
            'is_active'  => ['boolean'],
        ];
    }
}
