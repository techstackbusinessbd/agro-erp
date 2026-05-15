<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\GeneralStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // রাউট থেকে কোম্পানির আইডিটি নেওয়া (যাতে ইমেইল আপডেটে সমস্যা না হয়)
        $companyId = $this->route('company');

        return [
            'name'     => 'sometimes|required|string|max:150',
            'email'    => 'sometimes|required|email|unique:companies,email,' . $companyId,
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string',
            'logo'     => 'nullable|string',
            'status'   => ['nullable', new Enum(GeneralStatus::class)],
            'currency' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
        ];
    }
}
