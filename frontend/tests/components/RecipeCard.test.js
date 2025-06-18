import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RecipeCard from '@/components/RecipeCard.vue'

describe('RecipeCard', () => {
    it('renders a recipe name', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: { name: 'Chicken Parmesan', description: '' },
            },
        })

        expect(wrapper.find('[data-test="recipe-name"]').text()).toContain('Chicken Parmesan')
    })

    it('does NOT render recipe name element if missing name', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: { name: null, description: '' },
            },
        })

        expect(wrapper.find('[data-test="recipe-name"]').exists()).toBe(false)
    })

    it('does NOT render recipe description element if missing name', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: { name: null, description: '' },
            },
        })

        expect(wrapper.find('[data-test="recipe-description"]').exists()).toBe(false)
    })

    it('renders a description if provided', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    description: 'Spicy beef with guac',
                },
            },
        })

        expect(wrapper.find('[data-test="recipe-description"]').text()).toContain('Spicy beef with guac')
    })

    it('renders a ingredients count', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    description: 'Spicy beef with guac',
                    ingredients_count: 5,
                },
            },
        })

        expect(wrapper.find('[data-test="recipe-ingredients-count"]').text()).toContain('5')
    })

    it('renders a steps count', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    description: 'Spicy beef with guac',
                    steps_count: 5,
                },
            },
        })

        expect(wrapper.find('[data-test="recipe-steps-count"]').text()).toContain('5')
    })

    it('does NOT rendera a ingredients count if missing', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    description: 'Spicy beef with guac',
                },
            },
        })

        expect(wrapper.find('[data-test="recipe-ingredients-count"]').exists()).toBe(false)
    })

    it('renders a steps count', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    description: 'Spicy beef with guac',
                },
            },
        })

        expect(wrapper.find('[data-test="recipe-steps-count"]').exists()).toBe(false)
    })

    it('renders a View Recipe link with the correct URL', () => {
        const wrapper = mount(RecipeCard, {
            props: {
                recipe: {
                    name: 'Tacos',
                    slug: 'tacos',
                    description: 'Spicy beef with guac',
                },
            },
            global: {
                stubs: ['router-link'], // prevent real navigation
            },
        })

        const link = wrapper.find('[data-test="recipe-link"]')
        expect(link.exists()).toBe(true)
        expect(link.attributes('to')).toBe('/recipes/tacos')
    })
})
