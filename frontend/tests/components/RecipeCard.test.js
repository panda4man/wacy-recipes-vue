import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RecipeCard from '@/components/RecipeCard.vue'

const mountCard = (recipeOverrides = {}) => {
    const defaultRecipe = {
        name: 'Tacos',
        description: 'Spicy beef with guac',
        slug: 'tacos',
    }

    return mount(RecipeCard, {
        props: {
            recipe: { ...defaultRecipe, ...recipeOverrides },
        },
        global: {
            stubs: ['router-link'],
        },
    })
}

describe('RecipeCard.vue', () => {
    it('renders recipe name if present', () => {
        const wrapper = mountCard({ name: 'Chicken Parmesan' })
        expect(wrapper.find('[data-test="recipe-name"]').text()).toContain('Chicken Parmesan')
    })

    it('does not render name element if name is missing', () => {
        const wrapper = mountCard({ name: null })
        expect(wrapper.find('[data-test="recipe-name"]').exists()).toBe(false)
    })

    it('renders recipe description if present', () => {
        const wrapper = mountCard({ description: 'Some desc' })
        expect(wrapper.find('[data-test="recipe-description"]').text()).toContain('Some desc')
    })

    it('does not render description element if missing', () => {
        const wrapper = mountCard({ description: null })
        expect(wrapper.find('[data-test="recipe-description"]').exists()).toBe(false)
    })

    it('renders ingredients count if present', () => {
        const wrapper = mountCard({ ingredients_count: 5 })
        expect(wrapper.find('[data-test="recipe-ingredients-count"]').text()).toContain('5')
    })

    it('does not render ingredients count if missing', () => {
        const wrapper = mountCard({ ingredients_count: undefined })
        expect(wrapper.find('[data-test="recipe-ingredients-count"]').exists()).toBe(false)
    })

    it('renders steps count if present', () => {
        const wrapper = mountCard({ steps_count: 3 })
        expect(wrapper.find('[data-test="recipe-steps-count"]').text()).toContain('3')
    })

    it('does not render steps count if missing', () => {
        const wrapper = mountCard({ steps_count: undefined })
        expect(wrapper.find('[data-test="recipe-steps-count"]').exists()).toBe(false)
    })

    it('renders View Recipe link with correct slug URL', () => {
        const wrapper = mountCard({ slug: 'tacos' })
        const link = wrapper.find('[data-test="recipe-link"]')
        expect(link.exists()).toBe(true)
        expect(link.attributes('to')).toBe('/recipes/tacos')
    })
    it('calls truncate on description', async () => {
        // Dynamically re-import with the mock
        vi.resetModules()

        vi.doMock('@/utils/text', () => ({
            truncate: vi.fn(() => 'Truncated!')
        }))

        const { default: RecipeCard } = await import('@/components/RecipeCard.vue')
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    description: 'Some long description',
                    slug: 'tacos',
                },
            },
            global: {
                stubs: ['router-link'],
            },
        })

        expect(wrapper.find('[data-test="recipe-description"]').text()).toBe('Truncated!')
    })
})
