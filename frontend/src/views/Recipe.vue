<template>
    <div
        class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-10">
        <div class="w-full max-w-3xl bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <button @click="router.back()" data-test="back-button"
                class="mb-4 text-blue-700 dark:text-yellow-300 hover:underline flex items-center gap-1">
                <span>←</span> Back to Recipes
            </button>

            <div v-if="state.loading" data-test="loading-spinner">Loading...</div>

            <div v-if="state.error" data-test="error-wrapper" class="text-center text-red-600 dark:text-red-400 mb-6">
                <p class="mb-2">⚠️ Failed to load recipe details. Please check your connection or try again.</p>
                <button @click="fetchRecipe"
                    data-test="retry-button"
                    class="px-4 py-2 bg-alaska-gold text-white rounded hover:bg-alaska-gold-light transition">
                    Try Again
                </button>
            </div>

            <template v-else>
                <h1 data-test="recipe-name" class="text-3xl font-bold text-blue-900 dark:text-yellow-400 mb-2"
                    v-if="recipe.name">
                    {{ recipe.name }}
                </h1>
                <a :href="`mailto:${recipe.author_email}`" data-test="recipe-author"
                    class="text-gray-700 dark:text-gray-300 mb-4 italic" v-if="recipe.author_email">
                    By: {{ recipe.author_email }}
                </a>

                <p class="mb-6 mt-1 text-gray-800 dark:text-gray-200" data-test="recipe-description"
                    v-if="recipe.description">
                    {{ recipe.description }}
                </p>

                <div class="mb-6" v-if="recipe.ingredients?.length">
                    <h2 class="text-xl font-semibold text-blue-800 dark:text-yellow-300 mb-2">🧂 Ingredients</h2>
                    <ul data-test="recipe-ingredients" class="list-disc list-inside space-y-1">
                        <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
                            {{ ingredient.name }}
                        </li>
                    </ul>
                </div>

                <div v-if="recipe.steps?.length">
                    <h2 class="text-xl font-semibold text-blue-800 dark:text-yellow-300 mb-2">📋 Steps</h2>
                    <ol data-test="recipe-steps" class="list-decimal list-inside space-y-4">
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
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api'

const route = useRoute()
const router = useRouter()
const recipe = ref({
    name: '',
    description: '',
    author_email: '',
    ingredients: [],
    steps: [],
})
const state = reactive({
    error: false,
    loading: true,
})

const fetchRecipe = async () => {
    state.loading = true

    const slug = route.params.slug
    const { data, error } = await apiClient.get(`/recipes/${slug}`)

    state.loading = false

    if (error) {
        console.error('Error fetching recipe:', error)
        state.error = true
        return
    }

    if(!data || !data.data) {
        console.error('Invalid recipe data:', data)
        state.error = true
        return
    }
    
    state.error = false

    recipe.value = data.data || {
        name: '',
        description: '',
        author_email: '',
        ingredients: [],
        steps: [],
    }
}

onMounted(async () => {
    fetchRecipe()
})
</script>