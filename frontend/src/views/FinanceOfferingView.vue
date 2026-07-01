<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FinancePanel from '../components/FinancePanel.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import { celebrationTypeOptions, financeOfferingFormMock } from '../mock/appData.js'
import { api, formatCurrency, formatDate, toIsoDate } from '../services/api.js'

const { currentUser } = useAuth()

const financeOfferingForm = reactive({ ...financeOfferingFormMock })
const offerings = ref([])

const financeOfferingRows = computed(() =>
  offerings.value.map((offering) => ({
    id: offering.id,
    category: offering.tipoCelebracao,
    observation: offering.observacao ?? '',
    paymentDate: formatDate(offering.dataOferta),
    amount: formatCurrency(offering.valorTotal)
  }))
)

const sumRows = (rows, key) =>
  formatCurrency(rows.reduce((total, row) => total + Number(row[key] ?? 0), 0))

const offeringTotalLabel = computed(() => `TOTAL: ${sumRows(offerings.value, 'valorTotal')}`)

const loadOfferings = async () => {
  offerings.value = await api.get('/ofertas')
}

const save = async () => {
  try {
    await api.post('/ofertas', {
      tipoCelebracao: financeOfferingForm.celebrationType,
      valorTotal: financeOfferingForm.totalAmount,
      dataOferta: toIsoDate(financeOfferingForm.date),
      observacao: financeOfferingForm.observation,
      usuarioCadastroId: currentUser.value?.id
    })
    Object.assign(financeOfferingForm, financeOfferingFormMock)
    await loadOfferings()
    showToast('Oferta adicionada com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  Object.assign(financeOfferingForm, financeOfferingFormMock)
  showToast('Lançamento financeiro limpo.')
}

onMounted(async () => {
  try {
    await loadOfferings()
  } catch (error) {
    showToast(error.message, 'danger')
  }
})
</script>

<template>
  <FinancePanel
    variant="offering"
    :form="financeOfferingForm"
    :rows="financeOfferingRows"
    :celebration-type-options="celebrationTypeOptions"
    action-label="Adicionar"
    table-title="Ofertas registradas:"
    :total-label="offeringTotalLabel"
    @save="save"
    @cancel="cancel"
  />
</template>
