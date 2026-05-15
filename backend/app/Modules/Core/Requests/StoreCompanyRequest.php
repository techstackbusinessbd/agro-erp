<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\GeneralStatus;
use Illuminate\Validation\Rules\Enum;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // আপাতত true, পরে আমরা এখানে পারমিশন (Role) চেক করব
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:150',
            'email'    => 'required|email|unique:companies,email',
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string',
            'logo'     => 'nullable|string',
            'status'   => ['nullable', new Enum(GeneralStatus::class)], // Enum Validation
            'currency' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
        ];
    }
}
