import { createRouter, createWebHistory } from 'vue-router'

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
    }
  ]
})

export default router
