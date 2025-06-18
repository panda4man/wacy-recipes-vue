import { createRouter, createWebHistory } from 'vue-router'
import { recipeGuard } from '@/router/guards/recipeGuard.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/recipes'
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('@/views/Recipes.vue'),
    },
    {
      path: '/recipes/:slug',
      name: 'recipe',
      component: () => import('@/views/Recipe.vue'),
      beforeEnter: recipeGuard
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

export default router
