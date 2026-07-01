<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FinancePanel from '../components/FinancePanel.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import { financeCategoryOptions, financeExpenseFormMock } from '../mock/appData.js'
import { api, formatCurrency, formatDate, toIsoDate } from '../services/api.js'

const { currentUser } = useAuth()

const financeExpenseForm = reactive({ ...financeExpenseFormMock })
const expenses = ref([])

const financeExpenseRows = computed(() =>
  expenses.value.map((expense) => ({
    id: expense.id,
    category: expense.categoria?.nome ?? '',
    observation: expense.descricaoDespesa ?? '',
    paymentDate: formatDate(expense.dataDespesa),
    amount: formatCurrency(expense.valorDespesa)
  }))
)

const sumRows = (rows, key) =>
  formatCurrency(rows.reduce((total, row) => total + Number(row[key] ?? 0), 0))

const expenseTotalLabel = computed(() => `TOTAL: ${sumRows(expenses.value, 'valorDespesa')}`)

const loadExpenses = async () => {
  expenses.value = await api.get('/despesas')
}

const save = async () => {
  try {
    await api.post('/despesas', {
      categoriaNome: financeExpenseForm.category,
      descricaoDespesa: financeExpenseForm.observation,
      valorDespesa: financeExpenseForm.amount,
      dataDespesa: toIsoDate(financeExpenseForm.date),
      usuarioIds: currentUser.value?.id ? [currentUser.value.id] : []
    })
    Object.assign(financeExpenseForm, financeExpenseFormMock)
    await loadExpenses()
    showToast('Despesa adicionada com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  Object.assign(financeExpenseForm, financeExpenseFormMock)
  showToast('Lançamento financeiro limpo.')
}

onMounted(async () => {
  try {
    await loadExpenses()
  } catch (error) {
    showToast(error.message, 'danger')
  }
})
</script>

<template>
  <FinancePanel
    variant="expense"
    :form="financeExpenseForm"
    :rows="financeExpenseRows"
    :category-options="financeCategoryOptions"
    action-label="Adicionar"
    table-title="Despesas de hoje:"
    :total-label="expenseTotalLabel"
    @save="save"
    @cancel="cancel"
  />
</template>
