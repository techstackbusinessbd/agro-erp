<?php

namespace App\Modules\MasterData\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category');

        return [
            'parent_id'   => [
                'nullable', 
                'uuid', 
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($categoryId) {
                    if ($value === $categoryId) {
                        $fail('A category cannot be its own parent.');
                    }
                }
            ],
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'description' => ['nullable', 'string'],
            'is_active'   => ['boolean'],
        ];
    }
}
