<?php

use App\Models\Recipe;
use App\Models\Step;
use App\Models\Ingredient;
use function Pest\Laravel\get;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class)->in(__DIR__);

beforeEach(function () {
    Recipe::factory()
        ->count(3)
        ->has(Step::factory()->count(2))
        ->has(Ingredient::factory()->count(3))
        ->create();
});

//
// ─── COLLECTION ROUTE TESTS (/api/recipes) ─────────────────────────────────────
//

describe('GET /api/recipes', function () {
    test('it returns a list of recipes', function () {
        get('/api/recipes')
            ->assertOk()
            ->assertJsonStructure(['data' => [['name', 'slug', 'description']]]);
    });

    test('it supports pagination', function () {
        Recipe::factory()->count(20)->create();

        get('/api/recipes?page=2')
            ->assertOk()
            ->assertJsonStructure(['data', 'meta', 'links']);
    });

    test('returns empty data if no recipes exist', function () {
        \App\Models\Recipe::query()->delete();

        get('/api/recipes', ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonCount(0, 'data');
    });

    test('recipe list includes ingredient and step counts', function () {
        $recipe = Recipe::factory()
            ->has(Step::factory()->count(2))
            ->has(Ingredient::factory()->count(3))
            ->create();

        get('/api/recipes')
            ->assertOk()
            ->assertJsonFragment([
                'steps_count' => 2,
                'ingredients_count' => 3,
            ]);
    });
});

//
// ─── FILTERING TESTS ───────────────────────────────────────────────────────────
//

describe('Filtering recipes', function () {
    test('it filters recipes by keyword', function () {
        Recipe::factory()->create(['name' => 'Smoked Tacos']);

        get('/api/recipes?filter[keyword]=smoked')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => 'Smoked Tacos']);
    });

    test('it exactly filters recipes by author email', function () {
        Recipe::factory()->create(['author_email' => 'chef@example.com']);

        get('/api/recipes?filter[email]=chef@example.com')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['author_email' => 'chef@example.com']);
    });

    test('it returns empty result if email filter has no match', function () {
        get('/api/recipes?filter[email]=notfound@example.com')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    });

    test('it filters recipes by ingredient', function () {
        $recipe = Recipe::factory()->create();
        $recipe->ingredients()->create(['name' => 'Paprika']);

        get('/api/recipes?filter[ingredient]=paprika')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => $recipe->name]);
    });

    test('ingredient filter is case-insensitive', function () {
        $recipe = Recipe::factory()->create();
        $recipe->ingredients()->create(['name' => 'Paprika']);

        get('/api/recipes?filter[ingredient]=PAPRIKA')
            ->assertOk()
            ->assertJsonFragment(['name' => $recipe->name]);
    });

    test('it returns empty list if no results match', function () {
        get('/api/recipes?filter[keyword]=nope', ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonCount(0, 'data');
    });

    test('unknown filters are ignored', function () {
        get('/api/recipes?filter[unknown]=value', ['Accept' => 'application/json'])
            ->assertBadRequest();
    });

    test('it combines keyword and ingredient filters with AND logic', function () {
        // Matching both keyword and ingredient
        $matchingRecipe = \App\Models\Recipe::factory()->create([
            'name' => 'Spicy Tofu',
        ]);
        $matchingRecipe->ingredients()->create(['name' => 'Tofu']);

        // Matches only keyword
        \App\Models\Recipe::factory()->create(['name' => 'Spicy Chicken']);

        // Matches only ingredient
        $tofuOnlyRecipe = \App\Models\Recipe::factory()->create(['name' => 'Mild Tofu']);
        $tofuOnlyRecipe->ingredients()->create(['name' => 'Tofu']);

        get('/api/recipes?filter[keyword]=spicy&filter[ingredient]=tofu')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => $matchingRecipe->name]);
    });
});

//
// ─── PAGINATION VALIDATION ─────────────────────────────────────────────────────
//

describe('Pagination validation', function () {
    test('it returns 422 for invalid page parameter', function () {
        get('/api/recipes?page=-2', ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('page');
    });

    test('it returns 422 if page is not an integer', function () {
        get('/api/recipes?page=abc', ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('page');
    });

    test('pagination meta data is correct on first page', function () {
        Recipe::factory()->count(15)->create();

        get('/api/recipes?page=1')
            ->assertOk()
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', config('api.per_page'));
    });
});

//
// ─── DETAIL ROUTE TESTS (/api/recipes/{slug}) ──────────────────────────────────
//

describe('GET /api/recipes/{slug}', function () {
    test('it returns a single recipe by slug', function () {
        $recipe = Recipe::factory()
            ->has(Step::factory()->count(2))
            ->has(Ingredient::factory()->count(2))
            ->create();

        get("/api/recipes/{$recipe->slug}")
            ->assertOk()
            ->assertJsonFragment(['name' => $recipe->name])
            ->assertJsonStructure(['data' => ['steps', 'ingredients']]);
    });

    test('it returns 404 for invalid slug', function () {
        get('/api/recipes/nonexistent-slug')
            ->assertNotFound();
    });

    test('slug is case-sensitive', function () {
        $recipe = Recipe::factory()->create(['slug' => 'bbq-ribs']);
        get('/api/recipes/BBQ-RIBS', ['Accept' => 'application/json'])
            ->assertNotFound();
    });
});
