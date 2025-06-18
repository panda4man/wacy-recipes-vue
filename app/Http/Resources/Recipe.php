<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Recipe extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,
            'author_email' => $this->author_email,
            'ingredients' => Ingredient::collection($this->whenLoaded('ingredients')),
            'steps' => Step::collection($this->whenLoaded('steps')),
        ];

        if($this->steps_count) {
            $data['steps_count'] = $this->steps_count;
        }

        if($this->ingredients_count) {
            $data['ingredients_count'] = $this->ingredients_count;
        }

        return $data;
    }
}
