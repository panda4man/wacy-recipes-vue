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
            ->each(function (\App\Models\Recipe $recipe) {
                $steps = collect(range(1, fake()->numberBetween(3, 10)))
                    ->map(function ($i) {
                        return \App\Models\Step::factory()->make(['order' => $i]);
                    });

                $recipe->steps()->saveMany($steps);

                $recipe->ingredients()->saveMany(
                    \App\Models\Ingredient::factory()->count(fake()->numberBetween(3, 10))->make()
                );
            });
    }
}
