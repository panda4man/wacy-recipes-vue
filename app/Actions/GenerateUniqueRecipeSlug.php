<?php

namespace App\Actions;

use App\Models\Recipe;

class GenerateUniqueRecipeSlug
{
    public function handle(string $name): string
    {
        $baseSlug = str($name)->slug();
        $slug = $baseSlug;

        // Get all similar slugs at once
        $allSlugs = Recipe::where('slug', 'LIKE', "{$baseSlug}%")
            ->pluck('slug')
            ->all();

        if (!in_array($slug, $allSlugs)) {
            return $slug;
        }

        $i = 1;
        while (in_array("{$baseSlug}-{$i}", $allSlugs)) {
            $i++;
        }

        return "{$baseSlug}-{$i}";
    }
}