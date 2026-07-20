<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ActionButton from '../components/ActionButton.vue'
import BirthdaysCard from '../components/BirthdaysCard.vue'
import DonutChart from '../components/DonutChart.vue'
import RevenueLineChart from '../components/RevenueLineChart.vue'
import StatCard from '../components/StatCard.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import { quickActions } from '../config/navigation.js'
import {
  expenseDistribution,
  monthlyRevenueSeries
} from '../config/mockData.js'
import { api, formatCurrency, formatDate } from '../services/api.js'

const router = useRouter()
const { currentUser } = useAuth()

const dashboard = ref(null)

const firstName = computed(() => {
  const value = currentUser.value?.nomeDeUsuario ?? ''
  return value.split(/[._\s-]+/)[0] || 'usuário'
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
    label: 'Saldo mensal',
    value: formatCurrency(dashboard.value?.saldoMes ?? 0),
    icon: 'currency'
  },
  {
    id: 'offers',
    label: 'Arrecadado no mês',
    value: formatCurrency(dashboard.value?.totalArrecadadoMes ?? 0),
    icon: 'wallet'
  },
  {
    id: 'expenses',
    label: 'Despesas no mês',
    value: formatCurrency(dashboard.value?.totalDespesasMes ?? 0),
    icon: 'receipt'
  }
])

const incomeSplit = computed(() => ({
  labels: ['Contribuições', 'Ofertas'],
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
  return [...birthdays.value].sort((a, b) => Number(a.date.split('/')[0]) - Number(b.date.split('/')[0]))
})

const navigateTo = (screen) => {
  router.push({ name: screen })
}

const loadDashboard = async () => {
  dashboard.value = await api.get('/dashboard')
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
        <h2 class="dashboard__greeting">Olá, {{ firstName }}!</h2>
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
          title="Distribuição da arrecadação"
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
      <BirthdaysCard :birthdays="displayBirthdays" />
    </section>
  </section>
</template>

