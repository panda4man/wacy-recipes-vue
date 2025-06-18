import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Recipes from '@/views/Recipes.vue'
import { useRecipesStore } from '@/stores/useRecipesStore'
import { createTestingPinia } from '@pinia/testing'
import { useRouter, useRoute } from 'vue-router'
import flushPromises from 'flush-promises'

vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({ replace: vi.fn() })),
    useRoute: vi.fn(() => ({ query: {} })),
}))

vi.mock('@/stores/useRecipesStore', () => ({
    useRecipesStore: vi.fn()
}))

// define a global scrollTo mock
window.scrollTo = vi.fn()

describe('Recipes.vue', () => {
    let store
    const mountRecipes = () =>
        mount(Recipes, {
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn })],
                stubs: ['router-link'],
            }
        })

    beforeEach(() => {
        vi.clearAllMocks()

        store = {
            recipes: [
                { name: 'Tacos', slug: 'tacos', description: 'Delicious', steps_count: 2, ingredients_count: 3 },
                { name: 'Ribs', slug: 'ribs', description: 'Smoky', steps_count: 1, ingredients_count: 5 }
            ],
            meta: { total: 2, last_page: 1 },
            page: 1,
            filters: { keyword: '', email: '', ingredient: '' },
            fetchRecipes: vi.fn(),
            resetPage: vi.fn(),
            resetFilters: vi.fn(),
            changePage: vi.fn(),
            paginationRange: [1],
            error: false,
        }

        useRecipesStore.mockReturnValue(store)
    })

    describe('Initial Render', () => {
        it('calls fetchRecipes on mount', async () => {
            mountRecipes()
            await flushPromises()
            expect(store.fetchRecipes).toHaveBeenCalled()
        })

        it('renders search input and filters', async () => {
            const wrapper = mountRecipes()
            expect(wrapper.get('input[placeholder="Search recipes..."]')).toBeTruthy()
            expect(wrapper.get('[data-test="email-filter"]')).toBeTruthy()
            expect(wrapper.get('input[placeholder="ingredient"]')).toBeTruthy()
        })

        it('displays RecipeCards for available recipes', async () => {
            const wrapper = mountRecipes()
            await flushPromises()
            expect(wrapper.findAllComponents({ name: 'RecipeCard' })).toHaveLength(2)
        })

        it('renders pagination if last_page > 1', async () => {
            store.meta.last_page = 2
            const wrapper = mountRecipes()
            await flushPromises()
            expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
        })

        it('initializes filters from route query on mount', async () => {
            useRoute.mockReturnValue({
                query: {
                    keyword: 'ribs',
                    email: 'chef@example.com',
                    ingredient: 'smoke',
                    page: '2',
                }
            })

            const wrapper = mountRecipes()

            await flushPromises()

            expect(store.filters.keyword).toBe('ribs')
            expect(store.filters.email).toBe('chef@example.com')
            expect(store.filters.ingredient).toBe('smoke')
            expect(store.page).toBe(2)
            expect(store.fetchRecipes).toHaveBeenCalled()
        })
    })

    describe('Filter Behavior', () => {
        it('applies side filters', async () => {
            const wrapper = mountRecipes()
            await wrapper.get('[data-test="apply-filters"]').trigger('click')
            expect(store.fetchRecipes).toHaveBeenCalled()
        })

        it('clears filters when "Clear Filters" button is clicked', async () => {
            const wrapper = mountRecipes()
            await wrapper.get('[data-test="clear-filters"]').trigger('click')
            expect(store.resetFilters).toHaveBeenCalledWith(['ingredient', 'email'])
            expect(store.fetchRecipes).toHaveBeenCalled()
        })

        it('clears keyword when ✕ button is clicked', async () => {
            store.filters.keyword = 'taco'
            const wrapper = mountRecipes()
            await wrapper.get('[data-test="clear-keyword"]').trigger('click')
            expect(store.resetFilters).toHaveBeenCalledWith(['keyword'])
        })

        it('scrolls to top when recipes are fetched', async () => {
            const scrollToMock = vi.fn()
            window.scrollTo = scrollToMock

            mountRecipes()

            await flushPromises()

            expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
        })

        it('debounces search input before calling fetchRecipes', async () => {
            vi.useFakeTimers()

            const wrapper = mount(Recipes, {
                global: {
                    plugins: [createTestingPinia({ createSpy: vi.fn })],
                    stubs: ['router-link'],
                },
            })

            await flushPromises()
            const initialCallCount = store.fetchRecipes.mock.calls.length

            const input = wrapper.find('input[placeholder="Search recipes..."]')
            await input.setValue('taco')

            // Still same count after typing (debounced)
            expect(store.fetchRecipes).toHaveBeenCalledTimes(initialCallCount)

            vi.advanceTimersByTime(400)
            await flushPromises()

            // Called again after debounce delay
            expect(store.fetchRecipes).toHaveBeenCalledTimes(initialCallCount + 1)

            vi.useRealTimers()
        })

        it('calls fetchRecipes when page is changed via Pagination', async () => {
            store.meta.last_page = 2

            const wrapper = mountRecipes()

            await flushPromises()

            // simulate page change from pagination
            const pagination = wrapper.findComponent({ name: 'Pagination' })
            await pagination.vm.$emit('changePage', 2)

            expect(store.changePage).toHaveBeenCalledWith(2)
            expect(store.fetchRecipes).toHaveBeenCalled()
        })

        it('applies individual side filters correctly', async () => {
            const wrapper = mountRecipes()

            // simulate input
            const emailInput = wrapper.find('[data-test="email-filter"]')
            await emailInput.setValue('chef@example.com')

            await wrapper.find('[data-test="apply-filters"]').trigger('click')
            expect(store.fetchRecipes).toHaveBeenCalled()
        })

        it('handles invalid page query param gracefully', async () => {
            useRoute.mockReturnValue({
                query: { page: 'not-a-number', keyword: 'ribs' },
            })

            mountRecipes()
            await flushPromises()

            expect(store.page).toBe(1) // default fallback
            expect(store.filters.keyword).toBe('ribs')
        })

        it('does not show clear keyword button if keyword is empty', async () => {
            store.filters.keyword = ''
            const wrapper = mountRecipes()
            expect(wrapper.find('[data-test="clear-keyword"]').exists()).toBe(false)
        })
    })

    describe('Error and Empty State', () => {
        it('shows error message if store.error is true', async () => {
            store.error = true
            const wrapper = mountRecipes()
            await flushPromises()
            expect(wrapper.text()).toContain('We encountered an error processing your request')
        })

        it('shows "No recipes found" message if list is empty', async () => {
            store.recipes = []
            store.meta.total = 0
            const wrapper = mountRecipes()
            await flushPromises()
            expect(wrapper.text()).toContain('No recipes found')
        })
    })

    describe('Routing & Query Sync', () => {
        it('updates query string when filters/page change', async () => {
            const replaceMock = vi.fn()
            vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })

            mountRecipes()

            store.filters.keyword = 'ribs'
            store.filters.email = 'chef@example.com'
            store.page = 2
            await flushPromises()

            expect(replaceMock).toHaveBeenCalled()
        })
    })
})
