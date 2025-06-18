<template>
    <div class="flex flex-col lg:flex-row">
        <aside class="w-full lg:w-96 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-semibold text-xl">Filters</h2>
                <button @click="clearSideFilters" class="border rounded-lg py-2 px-4 hover:border-alaska-gold">clear</button>
            </div>

            <div class="bg-white rounded-lg p-4">
                <label class="block mb-2 text-sm font-medium">Filter by email</label>
                <input v-model="recipesStore.filters.email" type="email" placeholder="email"
                    class="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200" />

                <label class="block mt-4 mb-2 text-sm font-medium">Filter by ingredient</label>
                <input v-model="recipesStore.filters.ingredient" placeholder="ingredient"
                    class="w-full p-2 border rounded-lg border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200" />

                <button @click="applyFilters"
                    class="mt-6 w-full text-alaska-gold font-semibold border border-alaska-gold px-4 py-2 rounded hover:text-white hover:bg-alaska-gold transition">
                    Apply Filters
                </button>
            </div>
        </aside>

        <div class="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
            <h1 class="text-2xl mb-4">Find Your Recipe</h1>

            <div class="relative">
                <input v-model="recipesStore.filters.keyword" @input="debouncedFetch" type="text"
                    placeholder="Search recipes..."
                    class="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200" />

                <button v-if="recipesStore.filters.keyword" @click="clearKeyword"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
                    title="Clear">
                    ✕
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <RecipeCard v-for="recipe in recipesStore.recipes" :key="recipe.slug" :recipe="recipe" />
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-300 py-6 text-center" v-if="recipesStore.meta">
                Showing {{ recipesStore.recipes.length }} of {{ recipesStore.meta.total }} results
            </p>

            <div class="mt-2 flex flex-wrap items-center justify-between gap-4" v-if="recipesStore.meta">
                <!-- Prev -->
                <button @click="changePage(recipesStore.meta.current_page - 1)"
                    :disabled="recipesStore.meta.current_page <= 1"
                    class="px-3 py-1 bg-blue-900 text-white rounded disabled:opacity-50">
                    ← Prev
                </button>

                <!-- Page Numbers and Extras -->
                <div class="flex items-center space-x-1">
                    <!-- First -->
                    <button v-if="recipesStore.paginationRange[0] > 1" @click="changePage(1)"
                        class="px-3 py-1 bg-white dark:bg-gray-700 border rounded">
                        1
                    </button>

                    <!-- Ellipsis before -->
                    <span v-if="recipesStore.paginationRange[0] > 2" class="px-2">…</span>

                    <!-- Page Numbers -->
                    <button v-for="page in recipesStore.paginationRange" :key="page" @click="changePage(page)" :class="[
                        'px-3 py-1 rounded border',
                        page === recipesStore.meta.current_page
                            ? 'bg-yellow-500 text-black font-bold'
                            : 'bg-white dark:bg-gray-700',
                    ]">
                        {{ page }}
                    </button>

                    <!-- Ellipsis after -->
                    <span
                        v-if="recipesStore.paginationRange[recipesStore.paginationRange.length - 1] < recipesStore.meta.last_page - 1"
                        class="px-2">…</span>

                    <!-- Last -->
                    <button
                        v-if="recipesStore.paginationRange[recipesStore.paginationRange.length - 1] < recipesStore.meta.last_page"
                        @click="changePage(recipesStore.meta.last_page)"
                        class="px-3 py-1 bg-white dark:bg-gray-700 border rounded">
                        {{ recipesStore.meta.last_page }}
                    </button>
                </div>

                <!-- Next -->
                <button @click="changePage(recipesStore.meta.current_page + 1)"
                    :disabled="recipesStore.meta.current_page >= recipesStore.meta.last_page"
                    class="px-3 py-1 bg-blue-900 text-white rounded disabled:opacity-50">
                    Next →
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { useRecipesStore } from '@/stores/useRecipesStore'
import RecipeCard from '@/components/RecipeCard.vue'

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
    currentPage.value = 1

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
    recipesStore.page = page ? parseInt(page) : 1

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
