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
  paymentMethodOptions,
  reportTypeOptions
} from './config/options.js'
import { navigationItems, quickActions } from './config/navigation.js'
import {
  contributorFormDefaults,
  financeContributionFormDefaults,
  financeExpenseFormDefaults,
  financeOfferingFormDefaults,
  reportFormDefaults,
  userFormDefaults
} from './forms/defaultValues.js'
import { api, authToken, formatCurrency, formatDate, toIsoDate } from './services/api.js'

const currentScreen = ref('dashboard')
const isAuthenticated = ref(false)
const authView = ref('login')

const loginForm = reactive({
  username: '',
  password: '',
  email: ''
})

const userForm = reactive({ ...userFormDefaults })
const profileForm = reactive({
  fullName: 'Amanda Teodoro',
  username: 'amanda.teodoro',
  email: 'amanda@gmail.com',
  phone: '(69)9 9999-9999',
  accessLevel: 'Administrador'
})
const contributorForm = reactive({ ...contributorFormDefaults })
const financeContributionForm = reactive({ ...financeContributionFormDefaults })
const financeOfferingForm = reactive({ ...financeOfferingFormDefaults })
const financeExpenseForm = reactive({ ...financeExpenseFormDefaults })
const reportForm = reactive({ ...reportFormDefaults })

const feedback = ref('')
const loginFeedback = ref('')
const userSearch = ref('')
const contributorSearch = ref('')
const currentUser = ref(null)
const users = ref([])
const contributors = ref([])
const professions = ref([])
const expenseCategories = ref([])
let professionSearchTimer
const contributions = ref([])
const offerings = ref([])
const expenses = ref([])
const dashboard = ref(null)
const reportRows = ref([])
const editingUserId = ref(null)
const editingContributorId = ref(null)
const deleteConfirmation = reactive({
  visible: false,
  type: '',
  row: null
})
const isAdministrator = computed(
  () => currentUser.value?.nivelAcesso === 'Administrador'
)

const deleteConfirmationTitle = computed(() =>
  deleteConfirmation.type === 'user'
    ? 'Excluir usuário'
    : 'Excluir contribuinte'
)

const deleteConfirmationMessage = computed(() => {
  const name = deleteConfirmation.row?.name ?? 'este registro'

  return `Deseja realmente excluir ${name}?`
})

const allowedNavigationItems = computed(() => {
  if (isAdministrator.value) {
    return navigationItems
  }

  return navigationItems
    .map((item) => {
      if (!item.children) {
        return item
      }

      return {
        ...item,
        children: item.children.filter(
          (child) =>
            child.screen !== 'user-registration' &&
            child.screen !== 'user-consultation'
        )
      }
    })
    .filter((item) => !item.children || item.children.length)
})

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

const contributorNameOptions = computed(() =>
  [...new Set(contributors.value.map((contributor) => contributor.nomeCompleto).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, 'pt-BR'))
)

const professionOptions = computed(() =>
  professions.value.map(formatProfessionOption)
)

const financeCategoryOptions = computed(() =>
  expenseCategories.value.map((category) => category.nome)
)

const financeContributionRows = computed(() =>
  contributions.value.map((contribution) => ({
    id: contribution.id,
    contributor: contribution.contribuinte?.nomeCompleto ?? '',
    category: contribution.tipoContribuicao,
    observation: contribution.observacao ?? contribution.contribuinte?.nomeCompleto ?? '',
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
  if (screen === 'user-registration') {
    editingUserId.value = null
    resetForm(userForm, userFormDefaults)
  }

  if (screen === 'contributor-registration') {
    editingContributorId.value = null
    resetForm(contributorForm, contributorFormDefaults)
  }

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

const loadProfessions = async (search = '') => {
  const result = await api.get(
    `/profissoes?search=${encodeURIComponent(search)}&limit=20`
  )
  const merged = new Map(professions.value.map((profession) => [profession.id, profession]))

  result.forEach((profession) => merged.set(profession.id, profession))
  professions.value = [...merged.values()]
}

const loadExpenseCategories = async () => {
  expenseCategories.value = await api.get('/categorias-despesa')
}

const searchProfessions = (search) => {
  clearTimeout(professionSearchTimer)

  if (search.trim().length < 2) {
    return
  }

  professionSearchTimer = setTimeout(() => {
    loadProfessions(search).catch((error) => {
      feedback.value = error.message
    })
  }, 300)
}

const formatProfessionOption = (profession) => profession.nome

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
    const requests = [
      loadDashboard(),
      loadContributors(),
      loadProfessions(),
      loadExpenseCategories(),
      loadFinance()
    ]

    if (isAdministrator.value) {
      requests.push(loadUsers())
    }

    await Promise.all(requests)
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

    authToken.set(response.accessToken)
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
  authToken.clear()
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

const toDateInput = (value) => value?.slice(0, 10) ?? ''

const saveScreen = async (screen) => {
  try {
    if (screen === 'user-registration') {
      const payload = {
        nomeCompleto: userForm.fullName,
        nomeDeUsuario: userForm.username,
        email: userForm.email,
        nivelAcesso: userForm.accessLevel,
        telefone: userForm.phone
      }

      if (editingUserId.value) {
        if (userForm.password) {
          payload.senha = userForm.password
        }
        await api.patch(`/usuarios/${editingUserId.value}`, payload)
      } else {
        payload.senha = userForm.password
        await api.post('/usuarios', payload)
      }

      const wasEditing = Boolean(editingUserId.value)
      resetForm(userForm, userFormDefaults)
      await loadUsers()
      editingUserId.value = null
      currentScreen.value = 'user-consultation'
      feedback.value = wasEditing
        ? 'Usuário atualizado com sucesso.'
        : 'Usuário salvo com sucesso.'
      return
    }

    if (
      contributorForm.married &&
      (!contributorForm.spouseName.trim() ||
        !contributorForm.spousePhone.trim() ||
        !contributorForm.spouseBirthDate ||
        !contributorForm.spouseProfession.trim())
    ) {
      feedback.value =
        'Preencha nome, telefone, data de nascimento e profissão do cônjuge.'
      return
    }

    const profession = professions.value.find(
      (item) => formatProfessionOption(item) === contributorForm.profession
    )
    const spouseProfession = professions.value.find(
      (item) => formatProfessionOption(item) === contributorForm.spouseProfession
    )

    if (!profession) {
      feedback.value = 'Selecione uma profissão cadastrada.'
      return
    }

    if (contributorForm.married && !spouseProfession) {
      feedback.value = 'Selecione uma profissão cadastrada para o cônjuge.'
      return
    }

    const wasMarried = contributorForm.married

    const payload = {
      nomeCompleto: contributorForm.fullName,
      endereco: contributorForm.address,
      telefone: contributorForm.phone,
      dataDeNascimento: contributorForm.birthDate || undefined,
      profissaoIds: [profession.id],
      casado: contributorForm.married,
      nomeConjuge: contributorForm.spouseName || undefined,
      telefoneConjuge: contributorForm.spousePhone || undefined,
      dataNascimentoConjuge: contributorForm.spouseBirthDate || undefined,
      profissaoConjugeIds: spouseProfession ? [spouseProfession.id] : undefined
    }

    if (editingContributorId.value) {
      await api.patch(`/contribuintes/${editingContributorId.value}`, payload)
    } else {
      await api.post('/contribuintes', payload)
    }

    const wasEditing = Boolean(editingContributorId.value)
    resetForm(contributorForm, contributorFormDefaults)
    await Promise.all([loadContributors(), loadDashboard()])
    editingContributorId.value = null
    currentScreen.value = 'contributor-consultation'
    feedback.value = wasEditing
      ? 'Contribuinte atualizado com sucesso.'
      : wasMarried
        ? 'Contribuinte e cônjuge salvos com sucesso.'
        : 'Contribuinte salvo com sucesso.'
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
    const updated = await api.patch('/usuarios/me', {
      nomeCompleto: profileForm.fullName,
      nomeDeUsuario: profileForm.username,
      email: profileForm.email,
      telefone: profileForm.phone,
      nivelAcesso: profileForm.accessLevel
    })

    currentUser.value = updated
    if (isAdministrator.value) {
      await loadUsers()
    }
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
    resetForm(userForm, userFormDefaults)
    if (editingUserId.value) {
      editingUserId.value = null
      currentScreen.value = 'user-consultation'
      feedback.value = ''
      return
    }
  } else {
    resetForm(contributorForm, contributorFormDefaults)
    if (editingContributorId.value) {
      editingContributorId.value = null
      currentScreen.value = 'contributor-consultation'
      feedback.value = ''
      return
    }
  }

  feedback.value = 'Formulário limpo.'
}

const editRow = (row) => {
  if (currentScreen.value === 'user-consultation') {
    const user = users.value.find((item) => item.id === row.id)

    if (!user) {
      feedback.value = 'Usuário não encontrado.'
      return
    }

    editingUserId.value = user.id
    Object.assign(userForm, {
      fullName: user.nomeCompleto,
      username: user.nomeDeUsuario,
      password: '',
      email: user.email,
      accessLevel: user.nivelAcesso,
      phone: user.telefone ?? ''
    })
    currentScreen.value = 'user-registration'
    feedback.value = ''
    return
  }

  const contributor = contributors.value.find((item) => item.id === row.id)

  if (!contributor) {
    feedback.value = 'Contribuinte não encontrado.'
    return
  }

  const relatedProfessions = [
    ...(contributor.profissoes ?? []),
    ...(contributor.conjuge?.profissoes ?? [])
  ]
  const merged = new Map(professions.value.map((profession) => [profession.id, profession]))
  relatedProfessions.forEach((profession) => merged.set(profession.id, profession))
  professions.value = [...merged.values()]

  editingContributorId.value = contributor.id
  Object.assign(contributorForm, {
    fullName: contributor.nomeCompleto,
    address: contributor.endereco ?? '',
    phone: contributor.telefone ?? '',
    birthDate: toDateInput(contributor.dataDeNascimento),
    profession: contributor.profissoes?.[0]?.nome ?? '',
    married: contributor.casado,
    spouseName: contributor.conjuge?.nomeCompleto ?? '',
    spousePhone: contributor.conjuge?.telefone ?? '',
    spouseBirthDate: toDateInput(contributor.conjuge?.dataDeNascimento),
    spouseProfession: contributor.conjuge?.profissoes?.[0]?.nome ?? ''
  })
  currentScreen.value = 'contributor-registration'
  feedback.value = ''
}

const requestDeleteRow = (row) => {
  deleteConfirmation.visible = true
  deleteConfirmation.type = currentScreen.value === 'user-consultation' ? 'user' : 'contributor'
  deleteConfirmation.row = row
  feedback.value = ''
}

const cancelDeleteRow = () => {
  deleteConfirmation.visible = false
  deleteConfirmation.type = ''
  deleteConfirmation.row = null
}

const confirmDeleteRow = async () => {
  const row = deleteConfirmation.row

  if (!row) {
    cancelDeleteRow()
    return
  }

  try {
    if (deleteConfirmation.type === 'user') {
      await api.delete(`/usuarios/${row.id}`)
      await loadUsers()
    } else if (deleteConfirmation.type === 'contributor') {
      await api.delete(`/contribuintes/${row.id}`)
      await Promise.all([loadContributors(), loadDashboard()])
    }

    feedback.value = `${row.name} excluído com sucesso.`
    cancelDeleteRow()
  } catch (error) {
    feedback.value = error.message
  }
}

const saveFinance = async (screen) => {
  try {
    if (screen === 'finance-contribution') {
      const contributor = contributors.value.find(
        (item) =>
          item.nomeCompleto.trim().toLowerCase() ===
          financeContributionForm.contributor.trim().toLowerCase()
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
        contribuinteId: contributor.id
      })
      resetForm(financeContributionForm, financeContributionFormDefaults)
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
      resetForm(financeOfferingForm, financeOfferingFormDefaults)
      await Promise.all([loadFinance(), loadDashboard()])
      feedback.value = 'Oferta adicionada com sucesso.'
      return
    }

    await api.post('/despesas', {
      categoriaNome: financeExpenseForm.category,
      descricaoDespesa: financeExpenseForm.observation,
      valorDespesa: financeExpenseForm.amount,
      dataDespesa: toIsoDate(financeExpenseForm.date),
      usuarioId: currentUser.value?.id
    })
    resetForm(financeExpenseForm, financeExpenseFormDefaults)
    await Promise.all([loadFinance(), loadDashboard()])
    feedback.value = 'Despesa adicionada com sucesso.'
  } catch (error) {
    feedback.value = error.message
  }
}

const cancelFinance = (screen) => {
  if (screen === 'finance-contribution') {
    resetForm(financeContributionForm, financeContributionFormDefaults)
  } else if (screen === 'finance-offering') {
    resetForm(financeOfferingForm, financeOfferingFormDefaults)
  } else {
    resetForm(financeExpenseForm, financeExpenseFormDefaults)
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
  if (authToken.get()) {
    api.get('/usuarios/me')
      .then(async (usuario) => {
        currentUser.value = usuario
        Object.assign(profileForm, {
          fullName: usuario.nomeCompleto,
          username: usuario.nomeDeUsuario,
          email: usuario.email,
          phone: usuario.telefone ?? '',
          accessLevel: usuario.nivelAcesso
        })
        isAuthenticated.value = true
        await loadInitialData()
      })
      .catch(() => {
        authToken.clear()
      })
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
      :items="allowedNavigationItems"
      :current-screen="currentScreen"
      @navigate="setScreen"
      @logout="logout"
    />

    <div class="app-content">
      <TopBar :user="currentUser" @open-profile="openProfile" />

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
            :editing="Boolean(editingUserId)"
            @save="saveScreen('user-registration')"
            @cancel="cancelScreen('user-registration')"
          />
        </template>

        <template v-else-if="currentScreen === 'contributor-registration'">
          <ContributorRegistrationForm
            :form="contributorForm"
            :editing="Boolean(editingContributorId)"
            :profession-options="professionOptions"
            @profession-search="searchProfessions"
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
            @delete="requestDeleteRow"
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
            @delete="requestDeleteRow"
          />
        </template>

        <template v-else-if="currentScreen === 'finance-contribution'">
          <FinancePanel
            variant="contribution"
            :form="financeContributionForm"
            :rows="financeContributionRows"
            :contributor-options="contributorNameOptions"
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
            <h2>Tela indisponível</h2>
            <p>Não foi possível carregar esta área do sistema.</p>
          </div>
        </section>

        <p v-if="feedback" class="feedback-banner">{{ feedback }}</p>
      </main>

      <div v-if="deleteConfirmation.visible" class="modal-backdrop" role="presentation">
        <section
          class="confirmation-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="deleteConfirmation.type === 'user' ? 'delete-user-title' : 'delete-contributor-title'"
        >
          <h2 :id="deleteConfirmation.type === 'user' ? 'delete-user-title' : 'delete-contributor-title'">
            {{ deleteConfirmationTitle }}
          </h2>
          <p>{{ deleteConfirmationMessage }}</p>

          <div class="confirmation-modal__actions">
            <button type="button" class="confirmation-modal__button" @click="cancelDeleteRow">
              Cancelar
            </button>
            <button
              type="button"
              class="confirmation-modal__button confirmation-modal__button--danger"
              @click="confirmDeleteRow"
            >
              Excluir
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
