<?php

namespace App\Http\Controllers;


use App\Http\Filters\RecipeFuzzyFieldFilter;
use App\Http\Filters\RecipeFuzzyKeywordFilter;
use App\Http\Resources\Recipe as ResourcesRecipe;
use App\Models\Recipe;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RecipeController extends Controller
{
    public function index()
    {
        $recipes = QueryBuilder::for(Recipe::class)
            ->allowedFilters([
                AllowedFilter::exact('email', 'author_email'),
                AllowedFilter::custom('keyword', new RecipeFuzzyKeywordFilter),
                AllowedFilter::custom('ingredient', new RecipeFuzzyFieldFilter, 'ingredients.name')
            ])
            ->withCount(['steps', 'ingredients'])
            ->orderBy('created_at', 'desc')
            ->orderBy('name', 'asc')
            ->paginate(12)
            ->appends(request()->query());

        return ResourcesRecipe::collection($recipes);
    }

    public function show(Recipe $recipe)
    {
        $recipe->load(['steps', 'ingredients']);
        
        return ResourcesRecipe::make($recipe);
    }
}
