<?php

namespace App\Http\Controllers;


use App\Http\Filters\RecipeFuzzyFieldFilter;
use App\Http\Filters\RecipeFuzzyKeywordFilter;
use App\Http\Requests\RecipesIndexRequest;
use App\Http\Resources\Recipe as ResourcesRecipe;
use App\Models\Recipe;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class RecipeController extends Controller
{
    public function index(RecipesIndexRequest $request)
    {
        $recipes = QueryBuilder::for(Recipe::class)
            ->allowedFilters([
                AllowedFilter::exact('email', 'author_email'),
                AllowedFilter::custom('keyword', new RecipeFuzzyKeywordFilter),
                AllowedFilter::custom('ingredient', new RecipeFuzzyFieldFilter, 'ingredients.name')
            ])
            ->withCount(['steps', 'ingredients']) // just eager load counts for performance
            ->orderBy('created_at', 'desc') // show the most recent recipes first
            ->paginate(config('api.per_page')) // use the per_page config value or default to 12
            ->appends(request()->query()); // include all query parameters in pagination links

        return ResourcesRecipe::collection($recipes);
    }

    public function show(Recipe $recipe)
    {
        $recipe->load(['steps', 'ingredients']); //load here since we aren't using $with -> DANGER
        
        return ResourcesRecipe::make($recipe);
    }
}
