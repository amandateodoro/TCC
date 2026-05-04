<script setup>
import { computed, reactive, ref } from 'vue'
import ActionButton from './components/ActionButton.vue'
import BirthdaysCard from './components/BirthdaysCard.vue'
import ConsultationTable from './components/ConsultationTable.vue'
import ContributorRegistrationForm from './components/ContributorRegistrationForm.vue'
import FinancePanel from './components/FinancePanel.vue'
import LoginScreen from './components/LoginScreen.vue'
import ProfilePanel from './components/ProfilePanel.vue'
import ReportPanel from './components/ReportPanel.vue'
import SidebarNav from './components/SidebarNav.vue'
import StatCard from './components/StatCard.vue'
import TopBar from './components/TopBar.vue'
import UserRegistrationForm from './components/UserRegistrationForm.vue'
import {
  birthdays,
  celebrationTypeOptions,
  contributionTypeOptions,
  consultationContributorRows,
  consultationUserRows,
  contributorFormMock,
  financeCategoryOptions,
  financeContributionFormMock,
  financeContributionRows,
  financeExpenseFormMock,
  financeExpenseRows,
  financeOfferingFormMock,
  financeOfferingRows,
  navigationItems,
  paymentMethodOptions,
  quickActions,
  reportFormMock,
  reportTypeOptions,
  stats,
  userFormMock
} from './mock/appData.js'

const currentScreen = ref('dashboard')
const isAuthenticated = ref(false)
const authView = ref('login')

const loginForm = reactive({
  username: '',
  password: '',
  email: ''
})

const userForm = reactive({ ...userFormMock })
const profileForm = reactive({
  fullName: 'Amanda Teodoro',
  username: 'amanda.teodoro',
  email: 'amanda@gmail.com',
  phone: '(69)9 9999-9999',
  accessLevel: 'Administrador'
})
const contributorForm = reactive({ ...contributorFormMock })
const financeContributionForm = reactive({ ...financeContributionFormMock })
const financeOfferingForm = reactive({ ...financeOfferingFormMock })
const financeExpenseForm = reactive({ ...financeExpenseFormMock })
const reportForm = reactive({ ...reportFormMock })

const feedback = ref('')
const loginFeedback = ref('')
const userSearch = ref('')
const contributorSearch = ref('')

const userConsultationHeaders = [
  { key: 'name', label: 'Nome' },
  { key: 'phone', label: 'Telefone' },
  { key: 'birthDate', label: 'Data de Nascimento' },
  { key: 'accessLevel', label: 'Nível de Acesso' }
]

const contributorConsultationHeaders = [
  { key: 'name', label: 'Nome' },
  { key: 'phone', label: 'Telefone' },
  { key: 'birthDate', label: 'Data de Nascimento' }
]

const filteredUserRows = computed(() =>
  consultationUserRows.filter((row) =>
    row.name.toLowerCase().includes(userSearch.value.trim().toLowerCase())
  )
)

const filteredContributorRows = computed(() =>
  consultationContributorRows.filter((row) =>
    row.name.toLowerCase().includes(contributorSearch.value.trim().toLowerCase())
  )
)

const setScreen = (screen) => {
  currentScreen.value = screen
  feedback.value = ''
}

const openProfile = () => {
  currentScreen.value = 'profile'
  feedback.value = ''
}

const login = () => {
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    loginFeedback.value = 'Preencha usuário e senha para continuar.'
    return
  }

  loginFeedback.value = ''
  isAuthenticated.value = true
  authView.value = 'login'
  currentScreen.value = 'dashboard'
}

const openResetPassword = () => {
  authView.value = 'reset'
  loginFeedback.value = ''
}

const backToLogin = () => {
  authView.value = 'login'
  loginFeedback.value = ''
}

const sendResetLink = () => {
  if (!loginForm.email.trim()) {
    loginFeedback.value = 'Informe seu e-mail para continuar.'
    return
  }

  loginFeedback.value = 'Link de recuperação enviado com sucesso.'
}

const logout = () => {
  isAuthenticated.value = false
  authView.value = 'login'
  loginForm.username = ''
  loginForm.password = ''
  loginForm.email = ''
  loginFeedback.value = ''
  feedback.value = ''
}

const resetForm = (formState, defaults) => {
  Object.assign(formState, defaults)
}

const saveScreen = (screen) => {
  feedback.value =
    screen === 'user-registration'
      ? 'Usuário mockado salvo com sucesso.'
      : 'Contribuinte mockado salvo com sucesso.'
}

const saveProfile = () => {
  feedback.value = 'Perfil mockado salvo com sucesso.'
}

const cancelProfile = () => {
  Object.assign(profileForm, {
    fullName: 'Amanda Teodoro',
    username: 'amanda.teodoro',
    email: 'amanda@gmail.com',
    phone: '(69)9 9999-9999',
    accessLevel: 'Administrador'
  })
  feedback.value = 'Perfil restaurado.'
}

const cancelScreen = (screen) => {
  if (screen === 'user-registration') {
    resetForm(userForm, userFormMock)
  } else {
    resetForm(contributorForm, contributorFormMock)
  }

  feedback.value = 'Formulário limpo.'
}

const editRow = (row) => {
  feedback.value = `Edição mockada para ${row.name}.`
}

const deleteRow = (row) => {
  feedback.value = `Exclusão mockada para ${row.name}.`
}

const saveFinance = (screen) => {
  if (screen === 'finance-contribution') {
    feedback.value = 'Contribuição mockada adicionada com sucesso.'
    return
  }

  if (screen === 'finance-offering') {
    feedback.value = 'Oferta mockada adicionada com sucesso.'
    return
  }

  feedback.value = 'Despesa mockada adicionada com sucesso.'
}

const cancelFinance = (screen) => {
  if (screen === 'finance-contribution') {
    resetForm(financeContributionForm, financeContributionFormMock)
  } else if (screen === 'finance-offering') {
    resetForm(financeOfferingForm, financeOfferingFormMock)
  } else {
    resetForm(financeExpenseForm, financeExpenseFormMock)
  }

  feedback.value = 'Lançamento financeiro limpo.'
}

const generateReport = () => {
  feedback.value = 'Relatório mockado gerado com sucesso.'
}
</script>

<template>
  <LoginScreen
    v-if="!isAuthenticated"
    :mode="authView"
    v-model:username="loginForm.username"
    v-model:password="loginForm.password"
    v-model:email="loginForm.email"
    :feedback="loginFeedback"
    @login="login"
    @forgot="openResetPassword"
    @back="backToLogin"
    @reset="sendResetLink"
  />

  <div v-else class="app-shell">
    <SidebarNav
      :items="navigationItems"
      :current-screen="currentScreen"
      @navigate="setScreen"
      @logout="logout"
    />

    <div class="app-content">
      <TopBar @open-profile="openProfile" />

      <main class="dashboard-panel" :class="{ 'dashboard-panel--tight': currentScreen !== 'dashboard' }">
        <template v-if="currentScreen === 'dashboard'">
          <section class="actions-row">
            <ActionButton
              v-for="action in quickActions"
              :key="action.id"
              :label="action.label"
              @click="setScreen(action.targetScreen)"
            />
          </section>

          <section class="stats-grid">
            <StatCard
              v-for="stat in stats"
              :key="stat.id"
              :label="stat.label"
              :value="stat.value"
              :icon="stat.icon"
            />
          </section>

          <BirthdaysCard :birthdays="birthdays" />
        </template>

        <template v-else-if="currentScreen === 'user-registration'">
          <UserRegistrationForm
            :form="userForm"
            @save="saveScreen('user-registration')"
            @cancel="cancelScreen('user-registration')"
          />
        </template>

        <template v-else-if="currentScreen === 'contributor-registration'">
          <ContributorRegistrationForm
            :form="contributorForm"
            @save="saveScreen('contributor-registration')"
            @cancel="cancelScreen('contributor-registration')"
          />
        </template>

        <template v-else-if="currentScreen === 'profile'">
          <ProfilePanel
            :form="profileForm"
            @save="saveProfile"
            @cancel="cancelProfile"
          />
        </template>

        <template v-else-if="currentScreen === 'user-consultation'">
          <ConsultationTable
            v-model:query="userSearch"
            variant="user"
            search-label="Digite o nome do usuário"
            search-placeholder="Nome"
            table-title="Usuários cadastrados:"
            :headers="userConsultationHeaders"
            :rows="filteredUserRows"
            @edit="editRow"
            @delete="deleteRow"
          />
        </template>

        <template v-else-if="currentScreen === 'contributor-consultation'">
          <ConsultationTable
            v-model:query="contributorSearch"
            variant="contributor"
            search-label="Digite o nome do contribuinte"
            search-placeholder="Nome"
            table-title="Contribuintes cadastrados:"
            :headers="contributorConsultationHeaders"
            :rows="filteredContributorRows"
            @edit="editRow"
            @delete="deleteRow"
          />
        </template>

        <template v-else-if="currentScreen === 'finance-contribution'">
          <FinancePanel
            variant="contribution"
            :form="financeContributionForm"
            :rows="financeContributionRows"
            :contribution-type-options="contributionTypeOptions"
            :payment-method-options="paymentMethodOptions"
            action-label="Adicionar"
            table-title="Contribuições de hoje:"
            total-label="TOTAL: R$ 870,00"
            @save="saveFinance('finance-contribution')"
            @cancel="cancelFinance('finance-contribution')"
          />
        </template>

        <template v-else-if="currentScreen === 'finance-offering'">
          <FinancePanel
            variant="offering"
            :form="financeOfferingForm"
            :rows="financeOfferingRows"
            :celebration-type-options="celebrationTypeOptions"
            action-label="Adicionar"
            table-title="Ofertas registradas:"
            total-label="TOTAL: R$ 1.010,00"
            @save="saveFinance('finance-offering')"
            @cancel="cancelFinance('finance-offering')"
          />
        </template>

        <template v-else-if="currentScreen === 'finance-expense'">
          <FinancePanel
            variant="expense"
            :form="financeExpenseForm"
            :rows="financeExpenseRows"
            :category-options="financeCategoryOptions"
            action-label="Adicionar"
            table-title="Despesas de hoje:"
            total-label="TOTAL: R$ 000,00"
            @save="saveFinance('finance-expense')"
            @cancel="cancelFinance('finance-expense')"
          />
        </template>

        <template v-else-if="currentScreen === 'relatorio'">
          <ReportPanel
            :form="reportForm"
            :report-type-options="reportTypeOptions"
            @generate="generateReport"
          />
        </template>

        <section v-else class="screen-panel screen-panel--placeholder">
          <div class="placeholder-card">
            <h2>Tela em preparação</h2>
            <p>Essa área ainda está mockada, mas a navegação já segue o protótipo.</p>
          </div>
        </section>

        <p v-if="feedback" class="feedback-banner">{{ feedback }}</p>
      </main>
    </div>
  </div>
</template>
