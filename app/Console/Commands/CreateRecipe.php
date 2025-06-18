<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use Illuminate\Console\Command;

class CreateRecipe extends Command
{
    protected $signature = 'recipe:create';

    protected $description = 'Create a new recipe interactively';

    public function handle()
    {
        $name = $this->ask('Recipe name');
        $description = $this->ask('Recipe description');
        $authorEmail = $this->ask('Author email');

        $recipe = Recipe::create([
            'name' => $name,
            'description' => $description,
            'author_email' => $authorEmail
        ]);

        // Ingredients
        $this->info('Now add ingredients (type "done" to finish)');
        while (true) {
            $ingredient = $this->ask('Ingredient');
            if (strtolower($ingredient) === 'done') break;
            $recipe->ingredients()->create(['name' => $ingredient]);
        }

        // Steps
        $this->info('Now add steps (type "done" to finish)');
        $stepOrder = 1;
        while (true) {
            $step = $this->ask("Step {$stepOrder}");
            if (strtolower($step) === 'done') break;
            $recipe->steps()->create([
                'description' => $step,
                'order' => $stepOrder++,
            ]);
        }

        $this->info("✅ Recipe '{$recipe->name}' created successfully!");
        return Command::SUCCESS;
    }
}
