<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
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
  celebrationTypeOptions,
  contributionTypeOptions,
  contributorFormMock,
  financeCategoryOptions,
  financeContributionFormMock,
  financeExpenseFormMock,
  financeOfferingFormMock,
  navigationItems,
  paymentMethodOptions,
  quickActions,
  reportFormMock,
  reportTypeOptions,
  userFormMock
} from './mock/appData.js'
import { api, formatCurrency, formatDate, toIsoDate } from './services/api.js'

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
const currentUser = ref(null)
const users = ref([])
const contributors = ref([])
const contributions = ref([])
const offerings = ref([])
const expenses = ref([])
const dashboard = ref(null)
const reportRows = ref([])

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

const stats = computed(() => [
  {
    id: 'contributors',
    label: 'Total de Contribuintes',
    value: String(dashboard.value?.totalContribuintes ?? contributors.value.length),
    icon: 'user'
  },
  {
    id: 'amount',
    label: 'Total arrecadado no mês',
    value: formatCurrency(dashboard.value?.totalArrecadadoMes ?? 0),
    icon: 'currency'
  }
])

const birthdays = computed(() =>
  (dashboard.value?.aniversariantes ?? []).map((person) => ({
    id: person.id,
    name: person.nomeCompleto,
    date: formatDate(person.dataDeNascimento).slice(0, 5)
  }))
)

const consultationUserRows = computed(() =>
  users.value.map((user) => ({
    id: user.id,
    name: user.nomeCompleto,
    phone: user.telefone ?? '',
    birthDate: '',
    accessLevel: user.nivelAcesso
  }))
)

const consultationContributorRows = computed(() =>
  contributors.value.map((contributor) => ({
    id: contributor.id,
    name: contributor.nomeCompleto,
    phone: contributor.telefone ?? '',
    birthDate: formatDate(contributor.dataDeNascimento)
  }))
)

const financeContributionRows = computed(() =>
  contributions.value.map((contribution) => ({
    id: contribution.id,
    category: contribution.tipoContribuicao,
    observation: contribution.observacao ?? contribution.contribuintes?.map((item) => item.nomeCompleto).join(', ') ?? '',
    paymentDate: formatDate(contribution.dataDePagamento),
    amount: formatCurrency(contribution.valorContribuicao)
  }))
)

const financeOfferingRows = computed(() =>
  offerings.value.map((offering) => ({
    id: offering.id,
    category: offering.tipoCelebracao,
    observation: offering.observacao ?? '',
    paymentDate: formatDate(offering.dataOferta),
    amount: formatCurrency(offering.valorTotal)
  }))
)

const financeExpenseRows = computed(() =>
  expenses.value.map((expense) => ({
    id: expense.id,
    category: expense.categoria?.nome ?? '',
    observation: expense.descricaoDespesa ?? '',
    paymentDate: formatDate(expense.dataDespesa),
    amount: formatCurrency(expense.valorDespesa)
  }))
)

const contributionTotalLabel = computed(() => `TOTAL: ${sumRows(contributions.value, 'valorContribuicao')}`)
const offeringTotalLabel = computed(() => `TOTAL: ${sumRows(offerings.value, 'valorTotal')}`)
const expenseTotalLabel = computed(() => `TOTAL: ${sumRows(expenses.value, 'valorDespesa')}`)

const filteredUserRows = computed(() =>
  consultationUserRows.value.filter((row) =>
    row.name.toLowerCase().includes(userSearch.value.trim().toLowerCase())
  )
)

const filteredContributorRows = computed(() =>
  consultationContributorRows.value.filter((row) =>
    row.name.toLowerCase().includes(contributorSearch.value.trim().toLowerCase())
  )
)

const sumRows = (rows, key) =>
  formatCurrency(rows.reduce((total, row) => total + Number(row[key] ?? 0), 0))

const setScreen = (screen) => {
  currentScreen.value = screen
  feedback.value = ''

  if (screen === 'dashboard') {
    loadDashboard()
  }
}

const openProfile = () => {
  currentScreen.value = 'profile'
  feedback.value = ''
}

const loadDashboard = async () => {
  dashboard.value = await api.get('/dashboard')
}

const loadUsers = async () => {
  users.value = await api.get('/usuarios')
}

const loadContributors = async () => {
  contributors.value = await api.get('/contribuintes')
}

const loadFinance = async () => {
  const [contributionData, offeringData, expenseData] = await Promise.all([
    api.get('/contribuicoes'),
    api.get('/ofertas'),
    api.get('/despesas')
  ])

  contributions.value = contributionData
  offerings.value = offeringData
  expenses.value = expenseData
}

const loadInitialData = async () => {
  try {
    await Promise.all([loadDashboard(), loadUsers(), loadContributors(), loadFinance()])
  } catch (error) {
    feedback.value = error.message
  }
}

const login = async () => {
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    loginFeedback.value = 'Preencha usuário e senha para continuar.'
    return
  }

  try {
    const response = await api.post('/auth/login', {
      nomeDeUsuario: loginForm.username,
      senha: loginForm.password
    })

    currentUser.value = response.usuario
    Object.assign(profileForm, {
      fullName: response.usuario.nomeCompleto,
      username: response.usuario.nomeDeUsuario,
      email: response.usuario.email,
      phone: response.usuario.telefone ?? '',
      accessLevel: response.usuario.nivelAcesso
    })

    loginFeedback.value = ''
    isAuthenticated.value = true
    authView.value = 'login'
    currentScreen.value = 'dashboard'
    await loadInitialData()
  } catch (error) {
    loginFeedback.value = error.message
  }
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
  currentUser.value = null
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

const saveScreen = async (screen) => {
  try {
    if (screen === 'user-registration') {
      await api.post('/usuarios', {
        nomeCompleto: userForm.fullName,
        nomeDeUsuario: userForm.username,
        senha: userForm.password,
        email: userForm.email,
        nivelAcesso: userForm.accessLevel,
        telefone: userForm.phone
      })
      resetForm(userForm, userFormMock)
      await loadUsers()
      feedback.value = 'Usuário salvo com sucesso.'
      return
    }

    await api.post('/contribuintes', {
      nomeCompleto: contributorForm.fullName,
      endereco: contributorForm.address,
      telefone: contributorForm.phone,
      dataDeNascimento: contributorForm.birthDate || undefined,
      profissaoNome: contributorForm.profession,
      casado: contributorForm.married,
      nomeConjuge: contributorForm.spouseName || undefined,
      telefoneConjuge: contributorForm.spousePhone || undefined,
      dataNascimentoConjuge: contributorForm.spouseBirthDate || undefined,
      usuarioCadastroId: currentUser.value?.id
    })
    resetForm(contributorForm, contributorFormMock)
    await Promise.all([loadContributors(), loadDashboard()])
    feedback.value = 'Contribuinte salvo com sucesso.'
  } catch (error) {
    feedback.value = error.message
  }
}

const saveProfile = async () => {
  if (!currentUser.value?.id) {
    feedback.value = 'Faça login novamente para atualizar o perfil.'
    return
  }

  try {
    const updated = await api.patch(`/usuarios/${currentUser.value.id}`, {
      nomeCompleto: profileForm.fullName,
      nomeDeUsuario: profileForm.username,
      email: profileForm.email,
      telefone: profileForm.phone,
      nivelAcesso: profileForm.accessLevel
    })

    currentUser.value = updated
    await loadUsers()
    feedback.value = 'Perfil salvo com sucesso.'
  } catch (error) {
    feedback.value = error.message
  }
}

const cancelProfile = () => {
  const user = currentUser.value
  Object.assign(profileForm, {
    fullName: user?.nomeCompleto ?? '',
    username: user?.nomeDeUsuario ?? '',
    email: user?.email ?? '',
    phone: user?.telefone ?? '',
    accessLevel: user?.nivelAcesso ?? ''
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
  feedback.value = `Edição de ${row.name} ainda será conectada em uma próxima etapa.`
}

const deleteRow = async (row) => {
  try {
    if (currentScreen.value === 'user-consultation') {
      await api.delete(`/usuarios/${row.id}`)
      await loadUsers()
    } else if (currentScreen.value === 'contributor-consultation') {
      await api.delete(`/contribuintes/${row.id}`)
      await Promise.all([loadContributors(), loadDashboard()])
    }

    feedback.value = `${row.name} excluído com sucesso.`
  } catch (error) {
    feedback.value = error.message
  }
}

const saveFinance = async (screen) => {
  try {
    if (screen === 'finance-contribution') {
      const contributor = contributors.value.find((item) =>
        item.nomeCompleto.toLowerCase().includes(financeContributionForm.contributor.trim().toLowerCase())
      )

      if (!contributor) {
        feedback.value = 'Selecione um contribuinte cadastrado para registrar a contribuição.'
        return
      }

      await api.post('/contribuicoes', {
        tipoContribuicao: financeContributionForm.contributionType,
        valorContribuicao: financeContributionForm.amount,
        formaDePagamento: financeContributionForm.paymentMethod,
        dataDePagamento: toIsoDate(financeContributionForm.paymentDate),
        observacao: financeContributionForm.observation,
        usuarioCadastroId: currentUser.value?.id,
        contribuinteIds: [contributor.id]
      })
      resetForm(financeContributionForm, financeContributionFormMock)
      await Promise.all([loadFinance(), loadDashboard()])
      feedback.value = 'Contribuição adicionada com sucesso.'
      return
    }

    if (screen === 'finance-offering') {
      await api.post('/ofertas', {
        tipoCelebracao: financeOfferingForm.celebrationType,
        valorTotal: financeOfferingForm.totalAmount,
        dataOferta: toIsoDate(financeOfferingForm.date),
        observacao: financeOfferingForm.observation,
        usuarioCadastroId: currentUser.value?.id
      })
      resetForm(financeOfferingForm, financeOfferingFormMock)
      await Promise.all([loadFinance(), loadDashboard()])
      feedback.value = 'Oferta adicionada com sucesso.'
      return
    }

    await api.post('/despesas', {
      categoriaNome: financeExpenseForm.category,
      descricaoDespesa: financeExpenseForm.observation,
      valorDespesa: financeExpenseForm.amount,
      dataDespesa: toIsoDate(financeExpenseForm.date),
      usuarioIds: currentUser.value?.id ? [currentUser.value.id] : []
    })
    resetForm(financeExpenseForm, financeExpenseFormMock)
    await Promise.all([loadFinance(), loadDashboard()])
    feedback.value = 'Despesa adicionada com sucesso.'
  } catch (error) {
    feedback.value = error.message
  }
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

const generateReport = async () => {
  try {
    reportRows.value = await api.get(
      `/relatorios?tipo=${encodeURIComponent(reportForm.type)}&inicio=${encodeURIComponent(reportForm.startDate)}&fim=${encodeURIComponent(reportForm.endDate)}`
    )
    feedback.value = `Relatório gerado com ${reportRows.value.length} registro(s).`
  } catch (error) {
    feedback.value = error.message
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadInitialData()
  }
})
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
            :total-label="contributionTotalLabel"
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
            :total-label="offeringTotalLabel"
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
            :total-label="expenseTotalLabel"
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
