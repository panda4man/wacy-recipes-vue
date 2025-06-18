<template>
    <div :key="recipe.slug"
        class="p-4 rounded-lg shadow bg-white flex flex-col justify-between dark:bg-gray-800 hover:shadow-lg transition">
        <div>
            <h3 data-test="recipe-name" class="text-lg font-bold text-blue-900" v-if="recipe.name">{{ recipe.name }}</h3>
            <p data-test="recipe-description" class="text-sm mt-2 text-gray-700 dark:text-gray-300" v-if="recipe.description">{{ truncate(recipe.description) }}</p>
        </div>

        <div>
            <div class="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400" v-if="stepsCount || ingredientsCount">
                <span data-test="recipe-ingredients-count" v-if="ingredientsCount">🧂 {{ ingredientsCount }} ingredients</span>
                <span data-test="recipe-steps-count" v-if="stepsCount">📋 {{ stepsCount }} steps</span>
            </div>
            <router-link :to="`/recipes/${recipe.slug}`"
                data-test="recipe-link"
                class="w-full mt-2 block bg-alaska-gold text-center text-white font-semibold px-4 py-2 rounded hover:bg-alaska-gold-light transition">
                View Recipe
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { truncate } from '@/utils/text'

const props = defineProps({
    recipe: {
        type: Object,
        required: true
    }
})

const stepsCount = computed(() => props.recipe?.steps_count !== null ? props.recipe.steps_count : null)
const ingredientsCount = computed(() => props.recipe?.ingredients_count !== null ? props.recipe.ingredients_count : null)
</script>