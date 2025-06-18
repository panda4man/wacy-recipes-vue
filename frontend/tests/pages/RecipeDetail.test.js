import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Recipe from '@/views/Recipe.vue'
import apiClient from '@/api'
import { useRoute } from 'vue-router'
import flushPromises from 'flush-promises'

const mockRecipe = {
    name: 'BBQ Ribs',
    slug: 'bbq-ribs',
    description: 'Slow cooked and smoky.',
    author_email: 'chef@example.com',
    ingredients: [{ name: 'Ribs' }, { name: 'BBQ Sauce' }],
    steps: [{ description: 'Season the ribs' }, { description: 'Smoke for 4 hours' }]
}
const backMock = vi.fn()

vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
}))
vi.mock('@/api', () => ({
    default: {
        get: vi.fn()
    }
}))
vi.mock('vue-router', async () => {
    const actual = await vi.importActual('vue-router')

    return {
        ...actual,
        useRouter: () => ({
            back: backMock,
        }),
        useRoute: vi.fn(() => ({
            params: { slug: mockRecipe.slug },
        })),
    }
})

describe('Recipe.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        useRoute.mockReturnValue({ params: { slug: mockRecipe.slug } })
    })

    it('displays recipe details if API call succeeds', async () => {
        apiClient.get.mockResolvedValue({ data: { data: mockRecipe }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-name"]').text()).toContain('BBQ Ribs')
        expect(wrapper.find('[data-test="recipe-author"]').text()).toContain('chef@example.com')
        expect(wrapper.find('[data-test="recipe-description"]').text()).toContain('Slow cooked')

        expect(wrapper.findAll('[data-test="recipe-ingredients"] li')).toHaveLength(2)
        expect(wrapper.findAll('[data-test="recipe-steps"] li')).toHaveLength(2)
    })

    it('does not show ingredients section if empty', async () => {
        const data = { ...mockRecipe, ingredients: [] }
        apiClient.get.mockResolvedValue({ data: { data }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-ingredients"]').exists()).toBe(false)
    })

    it('does not show steps section if empty', async () => {
        const data = { ...mockRecipe, steps: [] }
        apiClient.get.mockResolvedValue({ data: { data }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-steps"]').exists()).toBe(false)
    })

    it('shows error state when API call fails', async () => {
        apiClient.get.mockResolvedValue({ data: null, error: new Error('Network error') })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="error-wrapper"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('Failed to load recipe')
    })

    it('calls the API with the correct slug from route params', async () => {
        apiClient.get.mockResolvedValue({ data: { data: mockRecipe }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(apiClient.get).toHaveBeenCalledWith('/recipes/bbq-ribs')
    })

    it('renders back button with correct label', async () => {
        apiClient.get.mockResolvedValue({ data: { data: mockRecipe }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="back-button"]').text()).toContain('Back to Recipes')
    })

    it('does not render recipe name element if missing', async () => {
        const data = { ...mockRecipe, name: null }
        apiClient.get.mockResolvedValue({ data: { data }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-name"]').exists()).toBe(false)
    })

    it('does not render recipe description element if missing', async () => {
        const data = { ...mockRecipe, description: null }
        apiClient.get.mockResolvedValue({ data: { data }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-description"]').exists()).toBe(false)
    })

    it('does not render recipe author element if missing', async () => {
        const data = { ...mockRecipe, author_email: null }
        apiClient.get.mockResolvedValue({ data: { data }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-author"]').exists()).toBe(false)
    })

    it('retries API call when clicking Try Again', async () => {
        // First call: fails
        apiClient.get.mockResolvedValueOnce({ data: null, error: new Error('Fail') })
        // Second call: succeeds
        apiClient.get.mockResolvedValueOnce({ data: { data: mockRecipe }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="error-wrapper"]').exists()).toBe(true)

        // Click "Try Again"
        await wrapper.find('[data-test="retry-button"]').trigger('click')
        await flushPromises()
        await flushPromises()

        // Safer assertion
        const nameEl = wrapper.find('[data-test="recipe-name"]')
        expect(nameEl.exists()).toBe(true)
        expect(nameEl.text()).toContain('BBQ Ribs')
        expect(apiClient.get).toHaveBeenCalledTimes(2)

        // Click "Back to Recipes"
        await wrapper.find('[data-test="back-button"]').trigger('click')
        expect(backMock).toHaveBeenCalled()
    })

    it('shows loading state before data arrives', async () => {
        let resolveApi

        apiClient.get.mockImplementation(() =>
            new Promise((resolve) => {
                resolveApi = () => resolve({ data: { data: mockRecipe }, error: null })
            })
        )

        const wrapper = mount(Recipe)

        expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(true)

        resolveApi()
        await flushPromises()

        expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(false)
    })

    it('does not show author if email is missing', async () => {
        const data = { ...mockRecipe, author_email: '' }
        apiClient.get.mockResolvedValue({ data: { data }, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="recipe-author"]').exists()).toBe(false)
    })

    it('renders author email as mailto link', async () => {
        apiClient.get.mockResolvedValue({ data: { data: mockRecipe }, error: null })

        const wrapper = await asyncMountRecipe()

        const authorEl = wrapper.find('[data-test="recipe-author"]')
        expect(authorEl.attributes('href')).toBe(`mailto:${mockRecipe.author_email}`)
    })

    it('shows error if API returns null data and no error', async () => {
        apiClient.get.mockResolvedValue({ data: null, error: null })

        const wrapper = await asyncMountRecipe()

        expect(wrapper.find('[data-test="error-wrapper"]').exists()).toBe(true)
    })
})

async function asyncMountRecipe(overrides = {}) {
  const wrapper = mount(Recipe, overrides)
  await flushPromises()
  return wrapper
}
