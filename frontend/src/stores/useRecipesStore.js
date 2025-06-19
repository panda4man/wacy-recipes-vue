import { defineStore } from "pinia"
import apiClient from "@/api"

export const useRecipesStore = defineStore("recipes", {
    state: () => ({
        recipes: [],
        loading: false,
        error: null,
        filters: {
            keyword: null,
            ingredient: null,
            email: null
        },
        page: 1,
        meta: null
    }),
    getters: {
        paginationRange: (state) => {
            if(!state.meta || !state.meta.last_page) {
                return []
            }

            const totalPages = state.meta.last_page
            const current = state.meta.current_page
            const delta = 2 // set the number of pages to show around the current page
            const range = []

            const start = Math.max(1, current - delta)
            const end = Math.min(totalPages, current + delta)

            for (let i = start; i <= end; i++) {
                range.push(i)
            }

            return range
        }
    },
    actions: {
        resetFilters(filters) {
            filters.forEach((filter) => {
                if (this.filters.hasOwnProperty(filter)) {
                    this.filters[filter] = null
                }
            })
        },
        resetPage() {
            this.page = 1
        },
        changePage(page) {
            if (this.page === page 
                || this.loading 
                || page < 1 
                || page > (this.meta ? this.meta.last_page : 1)) {
                return
            }

            this.page = page
        },
        async fetchRecipes() {
            if (this.loading) {
                return
            }

            this.loading = true
            this.error = null

            const { data, error } = await apiClient.get("/recipes", {
                params: {
                    page: this.page,
                    filter: {
                        keyword: this.filters.keyword,
                        ingredient: this.filters.ingredient,
                        email: this.filters.email
                    }
                }
            })

            this.loading = false

            if (error) {
                this.error = error
                this.recipes = []
                this.meta = null

                return
            }

            this.recipes = data.data || []
            this.meta = data.meta || null
        },
    },
})