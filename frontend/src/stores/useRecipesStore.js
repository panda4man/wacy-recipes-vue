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
        }
    }),
    actions: {
        async fetchRecipes() {
            this.loading = true
            this.error = null

            const {data, error} = await apiClient.get("/recipes")

            this.loading = false

            if(error) {
                this.error = error
            
                return
            }

            this.recipes = data.data || []
        },
    },
})