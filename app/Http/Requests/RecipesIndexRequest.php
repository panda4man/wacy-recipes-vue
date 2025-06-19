<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecipesIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'page' => ['nullable', 'integer', 'min:1'],
            'filter.keyword' => ['nullable', 'string'],
            'filter.email' => ['nullable', 'email'],
            'filter.ingredient' => ['nullable', 'string'],
        ];
    }

    public function prepareForValidation(): void
    {
        $filters = $this->input('filter', []);

        $sanitized = collect($filters)->mapWithKeys(function ($value, $key) {
            if ($key === 'email') {
                // Just trim email instead of purifying
                return [$key => $value];
            }

            return [$key => clean($value)];
        });

        $this->merge([
            'filter' => $sanitized->all(),
        ]);
    }
}
