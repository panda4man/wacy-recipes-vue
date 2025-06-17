<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="flex">
      <aside class="w-96 p-4 shadow-lg rounded-lg">
        <h2 class="font-semibold text-xl mb-4">Filters</h2>

        <div class="bg-white rounded-lg p-4">
            <label class="block mb-2 text-sm font-medium">Filter by email</label>
            <input
                v-model="selectedEmail"
                type="email"
                @input="applyFilters"
                placeholder="email"
                class="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200"
            />

            <label class="block mt-4 mb-2 text-sm font-medium">Filter by ingredient</label>
            <input
                v-model="selectedIngredient"
                @input="applyFilters"
                placeholder="ingredient"
                class="w-full p-2 border rounded-lg border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200"
            />
        </div>
        </aside>

      <div class="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
        <h1 class="text-2xl mb-4">Find Your Recipe</h1>

        <input
          v-model="search"
          type="text"
          placeholder="Search recipes..."
          class="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring focus:ring-blue-200"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div
            v-for="recipe in recipesStore.recipes"
            :key="recipe.slug"
            class="p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <h3 class="text-lg font-bold text-blue-900">{{ recipe.name }}</h3>
            <p class="text-sm mt-2 text-gray-700 dark:text-gray-300">{{ truncate(recipe.description) }}</p>
            <div class="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>🧂 {{ recipe.ingredients_count }} ingredients</span>
                <span>📋 {{ recipe.steps_count }} steps</span>
            </div>
            <div class="mt-4">
                <router-link
                :to="`/recipes/${recipe.slug}`"
                class="inline-block bg-alaska-gold text-white font-semibold px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                View Recipe
                </router-link>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-blue-900 rounded hover:bg-blue-800 disabled:opacity-50 transition"
          >Prev</button>
          <span class="self-center">Page {{ currentPage }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="!hasMore"
            class="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 transition"
          >Next</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
    import { ref, watch, onMounted } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRecipesStore } from '@/stores/useRecipesStore'

    const recipes = ref([])
    const emails = ref([])
    const ingredients = ref([])
    const search = ref('')
    const selectedEmail = ref('')
    const selectedIngredient = ref('')
    const currentPage = ref(1)
    const hasMore = ref(false)
    const recipesStore = useRecipesStore()

    const fetchRecipes = async () => {
        const params = new URLSearchParams()

        if (search.value) params.append('q', search.value)
        if (selectedEmail.value) params.append('email', selectedEmail.value)
        if (selectedIngredient.value) params.append('ingredient', selectedIngredient.value)

        params.append('page', currentPage.value)

        const { data, error } = await useFetch(`http://localhost:8888/api/recipes`, {
            server: false,
            lazy: true
        })

        if(data.value) {
            recipes.value = data.value.data
            hasMore.value = !!data.value.next_page_url
        }
    }

    const applyFilters = () => {
        currentPage.value = 1
        fetchRecipes()
    }

    const changePage = (page) => {
        currentPage.value = page
        fetchRecipes()
    }

    const debouncedFetch = useDebounceFn(() => {
        currentPage.value = 1
        fetchRecipes()
    }, 400)

    watch(search, debouncedFetch)

    onMounted(async () => {
        await recipesStore.fetchRecipes()
    })

    const truncate = (text, limit = 100) => {
        return text.length > limit ? text.slice(0, limit) + '...' : text
    }
</script>
