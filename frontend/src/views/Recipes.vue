<template>
    <div class="flex flex-col lg:flex-row">
        <aside class="w-full lg:w-96 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-semibold text-xl">Filters</h2>
                <button @click="clearSideFilters" data-test="clear-filters"
                    class="border rounded-lg py-2 px-4 hover:border-alaska-gold">clear</button>
            </div>

            <div class="bg-white rounded-lg p-4">
                <label class="block mb-2 text-sm font-medium">Filter by email</label>
                <input v-model="recipesStore.filters.email" type="email" placeholder="email" data-test="email-filter"
                    class="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200" />

                <label class="block mt-4 mb-2 text-sm font-medium">Filter by ingredient</label>
                <input v-model="recipesStore.filters.ingredient" placeholder="ingredient" data-test="ingredient-filter"
                    class="w-full p-2 border rounded-lg border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200" />

                <button @click="applyFilters" data-test="apply-filters"
                    class="mt-6 w-full text-alaska-gold font-semibold border border-alaska-gold px-4 py-2 rounded hover:text-white hover:bg-alaska-gold transition">
                    Apply Filters
                </button>
            </div>
        </aside>

        <div class="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
            <h1 class="text-2xl mb-4">Find Your Recipe</h1>

            <div class="relative">
                <input v-model="recipesStore.filters.keyword" 
                    @input="debouncedFetch" type="text"
                    autofocus
                    placeholder="Search recipes..."
                    class="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200" />

                <button v-if="recipesStore.filters.keyword" @click="clearKeyword" data-test="clear-keyword"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
                    title="Clear">
                    ✕
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <RecipeCard v-for="recipe in recipesStore.recipes" :key="recipe.slug" :recipe="recipe" />
            </div>

            <div class="mt-12 text-center text-red-600 dark:text-red-300" v-if="recipesStore.error">
                <p class="text-lg font-semibold">We encountered an error processing your request. Please try again.</p>
            </div>

            <template v-else>
                <div v-if="recipesStore.recipes.length === 0"
                    class="mt-12 text-center text-gray-600 dark:text-gray-300">
                    <p class="text-lg font-semibold">No recipes found</p>
                    <p class="text-sm mt-1">Try adjusting your filters or search terms.</p>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-300 py-6 text-center" v-else>
                    Showing {{ recipesStore.recipes.length }} of {{ recipesStore.meta.total }} results
                </p>

                <Pagination v-if="recipesStore.meta && recipesStore.meta.last_page > 1" :currentPage="recipesStore.page"
                    :lastPage="recipesStore.meta.last_page" :paginationRange="recipesStore.paginationRange"
                    @changePage="changePage" />
            </template>
        </div>
    </div>
</template>


<script setup>
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { useRecipesStore } from '@/stores/useRecipesStore'
import RecipeCard from '@/components/RecipeCard.vue'
import Pagination from '@/components/Pagination.vue'

const recipesStore = useRecipesStore()
const router = useRouter()
const route = useRoute()

const search = async () => {
    await recipesStore.fetchRecipes()

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearSideFilters = async () => {
    recipesStore.resetPage()
    recipesStore.resetFilters(['ingredient', 'email'])

    await search()
}

const clearKeyword = async () => {
    recipesStore.resetPage()
    recipesStore.resetFilters(['keyword'])

    await search()
}

const applyFilters = async () => {
    recipesStore.resetPage()

    await search()
}

const changePage = async (page) => {
    recipesStore.changePage(page)

    await search()
}

const debouncedFetch = useDebounceFn(async () => {
    recipesStore.resetPage()

    await search()
}, 400)

onMounted(async () => {
    const { keyword, email, ingredient, page } = route.query

    recipesStore.filters.keyword = keyword || ''
    recipesStore.filters.email = email || ''
    recipesStore.filters.ingredient = ingredient || ''

    const parsedPage = parseInt(page, 10)
    recipesStore.page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1

    await search()
})

watch(
    [() => recipesStore.filters.keyword, () => recipesStore.filters.email, () => recipesStore.filters.ingredient, () => recipesStore.page],
    () => {
        const query = {
            keyword: recipesStore.filters.keyword || undefined,
            email: recipesStore.filters.email || undefined,
            ingredient: recipesStore.filters.ingredient || undefined,
            page: recipesStore.page > 1 ? recipesStore.page : undefined,
        }

        router.replace({ query })
    },
    { immediate: true }
)
</script>
