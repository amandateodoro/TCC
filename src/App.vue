<script setup>
import { computed, reactive, ref } from 'vue'
import ActionButton from './components/ActionButton.vue'
import BirthdaysCard from './components/BirthdaysCard.vue'
import ConsultationTable from './components/ConsultationTable.vue'
import ContributorRegistrationForm from './components/ContributorRegistrationForm.vue'
import FinancePanel from './components/FinancePanel.vue'
import ReportPanel from './components/ReportPanel.vue'
import SidebarNav from './components/SidebarNav.vue'
import StatCard from './components/StatCard.vue'
import TopBar from './components/TopBar.vue'
import UserRegistrationForm from './components/UserRegistrationForm.vue'
import {
  birthdays,
  financeCategoryOptions,
  financeExpenseFormMock,
  financeExpenseRows,
  financeIncomeFormMock,
  financeIncomeRows,
  consultationContributorRows,
  consultationUserRows,
  contributorFormMock,
  navigationItems,
  quickActions,
  reportFormMock,
  reportTypeOptions,
  stats,
  userFormMock
} from './mock/appData.js'

const currentScreen = ref('dashboard')
const userForm = reactive({ ...userFormMock })
const contributorForm = reactive({ ...contributorFormMock })
const financeIncomeForm = reactive({ ...financeIncomeFormMock })
const financeExpenseForm = reactive({ ...financeExpenseFormMock })
const reportForm = reactive({ ...reportFormMock })
const feedback = ref('')
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

const resetForm = (formState, defaults) => {
  Object.assign(formState, defaults)
}

const saveScreen = (screen) => {
  feedback.value =
    screen === 'user-registration'
      ? 'Usuário mockado salvo com sucesso.'
      : 'Contribuinte mockado salvo com sucesso.'
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
  feedback.value =
    screen === 'finance-income'
      ? 'Entrada mockada adicionada com sucesso.'
      : 'Saída mockada adicionada com sucesso.'
}

const cancelFinance = (screen) => {
  if (screen === 'finance-income') {
    resetForm(financeIncomeForm, financeIncomeFormMock)
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
  <div class="app-shell">
    <SidebarNav
      :items="navigationItems"
      :current-screen="currentScreen"
      @navigate="setScreen"
    />

    <div class="app-content">
      <TopBar />

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

        <template v-else-if="currentScreen === 'finance-income'">
          <FinancePanel
            :form="financeIncomeForm"
            :rows="financeIncomeRows"
            :category-options="financeCategoryOptions"
            action-label="Adicionar"
            table-title="Entradas de hoje:"
            total-label="TOTAL: R$ 870,00"
            @save="saveFinance('finance-income')"
            @cancel="cancelFinance('finance-income')"
          />
        </template>

        <template v-else-if="currentScreen === 'finance-expense'">
          <FinancePanel
            :form="financeExpenseForm"
            :rows="financeExpenseRows"
            :category-options="financeCategoryOptions"
            action-label="Adicionar"
            table-title="Pagamentos de hoje:"
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
