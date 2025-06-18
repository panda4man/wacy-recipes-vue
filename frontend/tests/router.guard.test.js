// tests/router.guard.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import Recipe from '@/views/Recipe.vue'
import NotFound from '@/views/NotFound.vue'
import App from '@/App.vue'
import { recipeGuard } from '@/router/guards/recipeGuard.js'

const routes = [
    { path: '/recipes/:slug?', name: 'recipe', component: Recipe, beforeEnter: recipeGuard },
    { path: '/not-found', name: 'not-found', component: NotFound },
]

let router

beforeEach(() => {
    router = createRouter({
        history: createMemoryHistory(),
        routes,
    })
})

describe('Router Guards', () => {
    const mountApp = () => {
        return mount(App, {
            global: {
                plugins: [router],
                stubs: ['router-view'],
            },
        })
    }

    it('redirects to not-found when slug is missing', async () => {
        router.push({ name: 'recipe', params: { slug: undefined } })
        await router.isReady()

        const wrapper = mountApp()

        expect(router.currentRoute.value.name).toBe('not-found')
    })

    it('renders recipe view if slug is present', async () => {
        router.push({ name: 'recipe', params: { slug: 'bbq-ribs' } })
        await router.isReady()

        const wrapper = mountApp()

        expect(router.currentRoute.value.name).toBe('recipe')
        expect(router.currentRoute.value.params.slug).toBe('bbq-ribs')
    })
})
