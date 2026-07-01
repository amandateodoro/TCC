<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ActionButton from '../components/ActionButton.vue'
import BirthdaysCard from '../components/BirthdaysCard.vue'
import DashboardCalendar from '../components/DashboardCalendar.vue'
import DonutChart from '../components/DonutChart.vue'
import RevenueLineChart from '../components/RevenueLineChart.vue'
import StatCard from '../components/StatCard.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import {
  birthdays as birthdaysMock,
  expenseDistribution,
  monthlyRevenueSeries,
  quickActions
} from '../mock/appData.js'
import { api, formatCurrency, formatDate } from '../services/api.js'

const router = useRouter()
const { currentUser } = useAuth()

const dashboard = ref(null)

const firstName = computed(() => {
  const value = currentUser.value?.nomeDeUsuario ?? ''
  return value.split(/[._\s-]+/)[0] || 'usuario'
})

const today = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const stats = computed(() => [
  {
    id: 'contributors',
    label: 'Total de Contribuintes',
    value: String(dashboard.value?.totalContribuintes ?? 0),
    icon: 'users'
  },
  {
    id: 'amount',
    label: 'Arrecadado no mes',
    value: formatCurrency(dashboard.value?.totalArrecadadoMes ?? 0),
    icon: 'currency'
  },
  {
    id: 'offers',
    label: 'Ofertas no mes',
    value: formatCurrency(dashboard.value?.totalOfertasMes ?? 0),
    icon: 'wallet'
  },
  {
    id: 'expenses',
    label: 'Despesas no mes',
    value: formatCurrency(dashboard.value?.totalDespesasMes ?? 0),
    icon: 'receipt'
  }
])

const incomeSplit = computed(() => ({
  labels: ['Contribuicoes', 'Ofertas'],
  data: [
    Number(dashboard.value?.totalContribuicoesMes ?? 0),
    Number(dashboard.value?.totalOfertasMes ?? 0)
  ],
  colors: ['#945a22', '#c7a27d']
}))

const birthdays = computed(() =>
  (dashboard.value?.aniversariantes ?? []).map((person) => ({
    id: person.id,
    name: person.nomeCompleto,
    date: formatDate(person.dataDeNascimento).slice(0, 5)
  }))
)

const displayBirthdays = computed(() => {
  const list = birthdays.value.length ? birthdays.value : birthdaysMock
  return [...list].sort((a, b) => Number(a.date.split('/')[0]) - Number(b.date.split('/')[0]))
})

const displayCalendarEvents = computed(() =>
  displayBirthdays.value.map((person) => {
    const day = Number(person.date.split('/')[0])
    const firstName = person.name.split(' ')[0]
    return { id: person.id, day, label: `Aniversario: ${firstName}` }
  })
)

const navigateTo = (screen) => {
  router.push({ name: screen })
}

const loadDashboard = async () => {
  // dashboard.value = await api.get('/dashboard')
  dashboard.value = {
    totalContribuintes: 100,
    totalArrecadadoMes: 1000,
    totalOfertasMes: 100,
    totalDespesasMes: 100,
    aniversariantes: []
  }
}

onMounted(async () => {
  try {
    await loadDashboard()
  } catch (error) {
    if (error.status !== 401) {
      showToast(error.message, 'danger')
    }
  }
})
</script>

<template>
  <section class="dashboard">
    <header class="dashboard__hero">
      <div>
        <h2 class="dashboard__greeting">Ola, {{ firstName }}!</h2>
        <p class="dashboard__date">{{ today }}</p>
      </div>
      <div class="dashboard__quick">
        <ActionButton
          v-for="action in quickActions"
          :key="action.id"
          :label="action.label"
          @click="navigateTo(action.targetRoute)"
        />
      </div>
    </header>

    <section class="kpi-grid">
      <StatCard
        v-for="stat in stats"
        :key="stat.id"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
      />
    </section>

    <section class="dashboard__charts">
      <RevenueLineChart
        :labels="monthlyRevenueSeries.labels"
        :values="monthlyRevenueSeries.values"
      />
      <div class="dashboard__donuts">
        <DonutChart
          title="Distribuicao da arrecadacao"
          :labels="incomeSplit.labels"
          :data="incomeSplit.data"
          :colors="incomeSplit.colors"
        />
        <DonutChart
          title="Despesas por categoria"
          :labels="expenseDistribution.labels"
          :data="expenseDistribution.data"
          :colors="expenseDistribution.colors"
        />
      </div>
    </section>

    <section class="dashboard__bottom">
      <!-- <DashboardCalendar :events="displayCalendarEvents" /> -->
      <BirthdaysCard :birthdays="displayBirthdays" />
    </section>
  </section>
</template>
