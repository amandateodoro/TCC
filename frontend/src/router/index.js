import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import AppLayout from '../layouts/AppLayout.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      { path: 'dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'cadastro/usuario', name: 'user-registration', component: () => import('../views/UserRegistrationView.vue') },
      { path: 'cadastro/usuario/:id', name: 'user-edit', component: () => import('../views/UserRegistrationView.vue') },
      { path: 'cadastro/contribuinte', name: 'contributor-registration', component: () => import('../views/ContributorRegistrationView.vue') },
      { path: 'cadastro/contribuinte/:id', name: 'contributor-edit', component: () => import('../views/ContributorRegistrationView.vue') },
      { path: 'consulta/usuarios', name: 'user-consultation', component: () => import('../views/UserConsultationView.vue') },
      { path: 'consulta/contribuintes', name: 'contributor-consultation', component: () => import('../views/ContributorConsultationView.vue') },
      { path: 'financeiro/contribuicoes', name: 'finance-contribution', component: () => import('../views/FinanceContributionView.vue') },
      { path: 'financeiro/ofertas', name: 'finance-offering', component: () => import('../views/FinanceOfferingView.vue') },
      { path: 'financeiro/despesas', name: 'finance-expense', component: () => import('../views/FinanceExpenseView.vue') },
      { path: 'relatorio', name: 'relatorio', component: () => import('../views/ReportView.vue') },
      { path: 'perfil', name: 'profile', component: () => import('../views/ProfileView.vue') }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
})

export default router
