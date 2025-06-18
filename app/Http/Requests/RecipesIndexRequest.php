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
}
