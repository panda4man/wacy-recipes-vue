<template>
    <div
        class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-10">
        <div class="w-full max-w-3xl bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <button @click="$router.back()"
                class="mb-4 text-blue-700 dark:text-yellow-300 hover:underline flex items-center gap-1">
                <span>←</span> Back to Recipes
            </button>

            <div v-if="state.error" class="text-center text-red-600 dark:text-red-400 mb-6">
                <p class="mb-2">⚠️ Failed to load recipe details. Please check your connection or try again.</p>
                <button @click="fetchRecipe"
                    class="px-4 py-2 bg-alaska-gold text-white rounded hover:bg-alaska-gold-light transition">
                    Try Again
                </button>
            </div>

            <template v-else>
                <h1 class="text-3xl font-bold text-blue-900 dark:text-yellow-400 mb-2">{{ recipe.name }}</h1>
                <a :href="`mailto:${recipe.author_email}`" class="text-gray-700 dark:text-gray-300 mb-4 italic">By: {{
                    recipe.author_email }}</a>

                <p class="mb-6 mt-1 text-gray-800 dark:text-gray-200">{{ recipe.description }}</p>

                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-blue-800 dark:text-yellow-300 mb-2">🧂 Ingredients</h2>
                    <ul class="list-disc list-inside space-y-1">
                        <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
                            {{ ingredient.name }}
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 class="text-xl font-semibold text-blue-800 dark:text-yellow-300 mb-2">📋 Steps</h2>
                    <ol class="list-decimal list-inside space-y-4">
                        <li v-for="(step, index) in recipe.steps" :key="index">
                            {{ step.description }}
                        </li>
                    </ol>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const recipe = ref({
    name: '',
    description: '',
    author_email: '',
    ingredients: [],
    steps: [],
})
const state = reactive({
    error: false,
    loading: false,
})

onMounted(async () => {
    state.loading = true
    const slug = route.params.slug
    const { data, error } = await apiClient.get(`/recipes/${slug}`)

    state.loading = false

    if (error) {
        console.error('Error fetching recipe:', error)
        state.error = true
        return
    }

    recipe.value = data.data || {
        name: '',
        description: '',
        author_email: '',
        ingredients: [],
        steps: [],
    }
})
</script>