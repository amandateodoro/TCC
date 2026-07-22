import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import AppLayout from '../layouts/AppLayout.vue'
import LoginView from '../views/LoginView.vue'

const ACESSO_DASHBOARD = ['Administrador', 'Secretaria', 'Pastoral do Dízimo']
const ACESSO_FINANCEIRO = ['Administrador', 'Secretaria', 'Pastoral do Dízimo']
const ACESSO_RELATORIOS = ['Administrador', 'Secretaria', 'Pastoral do Dízimo']
const ACESSO_CADASTROS = ['Administrador', 'Secretaria']

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
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { allowedRoles: ACESSO_DASHBOARD }
      },
      {
        path: 'cadastro/usuario',
        name: 'user-registration',
        component: () => import('../views/UserRegistrationView.vue'),
        meta: { adminOnly: true }
      },
      {
        path: 'cadastro/usuario/:id',
        name: 'user-edit',
        component: () => import('../views/UserRegistrationView.vue'),
        meta: { adminOnly: true }
      },
      {
        path: 'cadastro/contribuinte',
        name: 'contributor-registration',
        component: () => import('../views/ContributorRegistrationView.vue'),
        meta: { allowedRoles: ACESSO_CADASTROS }
      },
      {
        path: 'cadastro/contribuinte/:id',
        name: 'contributor-edit',
        component: () => import('../views/ContributorRegistrationView.vue'),
        meta: { allowedRoles: ACESSO_CADASTROS }
      },
      {
        path: 'consulta/usuarios',
        name: 'user-consultation',
        component: () => import('../views/UserConsultationView.vue'),
        meta: { adminOnly: true }
      },
      {
        path: 'consulta/contribuintes',
        name: 'contributor-consultation',
        component: () => import('../views/ContributorConsultationView.vue'),
        meta: { allowedRoles: ACESSO_CADASTROS }
      },
      {
        path: 'financeiro/contribuicoes',
        name: 'finance-contribution',
        component: () => import('../views/FinanceContributionView.vue'),
        meta: { allowedRoles: ACESSO_FINANCEIRO }
      },
      {
        path: 'financeiro/ofertas',
        name: 'finance-offering',
        component: () => import('../views/FinanceOfferingView.vue'),
        meta: { allowedRoles: ACESSO_FINANCEIRO }
      },
      {
        path: 'financeiro/despesas',
        name: 'finance-expense',
        component: () => import('../views/FinanceExpenseView.vue'),
        meta: { allowedRoles: ACESSO_FINANCEIRO }
      },
      {
        path: 'relatorio',
        name: 'relatorio',
        component: () => import('../views/ReportView.vue'),
        meta: { allowedRoles: ACESSO_RELATORIOS }
      },
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
  const { currentUser, isAuthenticated } = useAuth()

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.matched.some((record) => record.meta.adminOnly) && currentUser.value?.nivelAcesso !== 'Administrador') {
    return { name: 'dashboard' }
  }

  const allowedRoles = to.meta.allowedRoles

  if (allowedRoles && !allowedRoles.includes(currentUser.value?.nivelAcesso)) {
    return { name: 'dashboard' }
  }

  if (to.meta.guest && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
})

export default router
