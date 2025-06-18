<template>
    <div :key="recipe.slug"
        class="p-4 rounded-lg shadow bg-white flex flex-col justify-between dark:bg-gray-800 hover:shadow-lg transition">
        <div>
            <h3 class="text-lg font-bold text-blue-900">{{ recipe.name }}</h3>
            <p class="text-sm mt-2 text-gray-700 dark:text-gray-300">{{ truncate(recipe.description) }}</p>
        </div>

        <div>
            <div class="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>🧂 {{ recipe.ingredients_count }} ingredients</span>
                <span>📋 {{ recipe.steps_count }} steps</span>
            </div>
            <router-link :to="`/recipes/${recipe.slug}`"
                class="w-full mt-2 block bg-alaska-gold text-center text-white font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition">
                View Recipe
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { truncate } from '@/utils/text';

const props = defineProps({
    recipe: {
        type: Object,
        required: true
    }
})
</script>