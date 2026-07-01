<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FinancePanel from '../components/FinancePanel.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import {
  contributionTypeOptions,
  financeContributionFormMock,
  paymentMethodOptions
} from '../mock/appData.js'
import { api, formatCurrency, formatDate, toIsoDate } from '../services/api.js'

const { currentUser } = useAuth()

const financeContributionForm = reactive({ ...financeContributionFormMock })
const contributions = ref([])
const contributors = ref([])

const contributorNameOptions = computed(() =>
  [...new Set(contributors.value.map((contributor) => contributor.nomeCompleto).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, 'pt-BR'))
)

const financeContributionRows = computed(() =>
  contributions.value.map((contribution) => ({
    id: contribution.id,
    contributor: contribution.contribuintes?.map((item) => item.nomeCompleto).join(', ') ?? '',
    category: contribution.tipoContribuicao,
    observation: contribution.observacao ?? contribution.contribuintes?.map((item) => item.nomeCompleto).join(', ') ?? '',
    paymentDate: formatDate(contribution.dataDePagamento),
    amount: formatCurrency(contribution.valorContribuicao)
  }))
)

const sumRows = (rows, key) =>
  formatCurrency(rows.reduce((total, row) => total + Number(row[key] ?? 0), 0))

const contributionTotalLabel = computed(() => `TOTAL: ${sumRows(contributions.value, 'valorContribuicao')}`)

const loadContributions = async () => {
  contributions.value = await api.get('/contribuicoes')
}

const loadContributors = async () => {
  contributors.value = await api.get('/contribuintes')
}

const save = async () => {
  try {
    const contributor = contributors.value.find(
      (item) =>
        item.nomeCompleto.trim().toLowerCase() ===
        financeContributionForm.contributor.trim().toLowerCase()
    )

    if (!contributor) {
      showToast('Selecione um contribuinte cadastrado para registrar a contribuição.', 'warning')
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
    Object.assign(financeContributionForm, financeContributionFormMock)
    await loadContributions()
    showToast('Contribuição adicionada com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  Object.assign(financeContributionForm, financeContributionFormMock)
  showToast('Lançamento financeiro limpo.')
}

onMounted(async () => {
  try {
    await Promise.all([loadContributions(), loadContributors()])
  } catch (error) {
    showToast(error.message, 'danger')
  }
})
</script>

<template>
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
    @save="save"
    @cancel="cancel"
  />
</template>
