<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FinancePanel from '../components/FinancePanel.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import { celebrationTypeOptions } from '../config/options.js'
import { financeOfferingFormDefaults } from '../config/defaultValues.js'
import { formatCurrency, formatDate, isFutureDate, todayIsoDate, toIsoDate } from '../common/dataFormatters.js'
import { api } from '../services/api.js'

const { currentUser } = useAuth()

const financeOfferingForm = reactive({ ...financeOfferingFormDefaults })
const offerings = ref([])

const todayOfferings = computed(() =>
  offerings.value.filter((offering) => offering.dataOferta === todayIsoDate())
)

const financeOfferingRows = computed(() =>
  todayOfferings.value.map((offering) => ({
    id: offering.id,
    category: offering.tipoCelebracao,
    observation: offering.observacao ?? '',
    paymentDate: formatDate(offering.dataOferta),
    amount: formatCurrency(offering.valorTotal)
  }))
)

const sumRows = (rows, key) =>
  formatCurrency(rows.reduce((total, row) => total + Number(row[key] ?? 0), 0))

const offeringTotalLabel = computed(() => `TOTAL: ${sumRows(todayOfferings.value, 'valorTotal')}`)

const loadOfferings = async () => {
  offerings.value = await api.get('/ofertas')
}

const save = async () => {
  try {
    const offeringDate = toIsoDate(financeOfferingForm.date)

    if (isFutureDate(offeringDate)) {
      showToast('A data da oferta não pode ser futura.', 'danger')
      return
    }

    await api.post('/ofertas', {
      tipoCelebracao: financeOfferingForm.celebrationType,
      valorTotal: financeOfferingForm.totalAmount,
      dataOferta: offeringDate,
      observacao: financeOfferingForm.observation,
      usuarioCadastroId: currentUser.value?.id
    })
    Object.assign(financeOfferingForm, financeOfferingFormDefaults)
    await loadOfferings()
    showToast('Oferta adicionada com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  Object.assign(financeOfferingForm, financeOfferingFormDefaults)
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
