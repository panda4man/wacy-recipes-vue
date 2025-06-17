<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Recipe::factory(200)
            ->create()
            ->each(function ($recipe) {
                $recipe->steps()->saveMany(
                    \App\Models\Step::factory()->count(fake()->numberBetween(3, 10))->make()
                );
                $recipe->ingredients()->saveMany(
                    \App\Models\Ingredient::factory()->count(fake()->numberBetween(3, 10))->make()
                );
            });
    }
}
