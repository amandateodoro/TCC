<script setup>
import { computed, reactive, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ReportPanel from '../components/ReportPanel.vue'
import { showToast } from '../composables/useToast.js'
import { reportTypeOptions } from '../config/options.js'
import { reportFormDefaults } from '../forms/defaultValues.js'
import { api, formatCurrency, formatDate } from '../services/api.js'

const reportForm = reactive({ ...reportFormDefaults })
const reportRows = ref([])
const generatedReportType = ref('')

const normalizedReportType = computed(() =>
  generatedReportType.value.toLocaleLowerCase('pt-BR')
)

const reportTitle = computed(() =>
  generatedReportType.value ? `Relatorio de ${generatedReportType.value}` : 'Relatorio'
)

const periodLabel = computed(() => {
  if (reportForm.startDate && reportForm.endDate) {
    return `${formatDate(reportForm.startDate)} a ${formatDate(reportForm.endDate)}`
  }

  if (normalizedReportType.value.includes('anivers')) {
    return 'Mês atual'
  }

  return 'Todos os registros'
})

const reportColumns = computed(() => {
  if (normalizedReportType.value.includes('contrib')) {
    return ['Contribuinte', 'Tipo', 'Pagamento', 'Data', 'Valor', 'Observacao']
  }

  if (normalizedReportType.value.includes('desp')) {
    return ['Categoria', 'Descricao', 'Data', 'Valor']
  }

  return ['Nome', 'Telefone', 'Data de nascimento']
})

const getReportCellValue = (row, column) => {
  const columnMap = {
    Contribuinte: row.contribuinte?.nomeCompleto,
    Tipo: row.tipoContribuicao,
    Pagamento: row.formaDePagamento,
    Data: row.dataDePagamento
      ? formatDate(row.dataDePagamento)
      : row.dataDespesa
        ? formatDate(row.dataDespesa)
        : '',
    Valor: row.valorContribuicao
      ? formatCurrency(row.valorContribuicao)
      : row.valorDespesa
        ? formatCurrency(row.valorDespesa)
        : '',
    Observacao: row.observacao,
    Categoria: row.categoria?.nome,
    Descricao: row.descricaoDespesa,
    Nome: row.nomeCompleto,
    Telefone: row.telefone,
    'Data de nascimento': row.dataDeNascimento ? formatDate(row.dataDeNascimento) : ''
  }

  return columnMap[column] || '-'
}

const totalAmount = computed(() =>
  reportRows.value.reduce(
    (total, row) => total + Number(row.valorContribuicao ?? row.valorDespesa ?? 0),
    0
  )
)

const shouldShowTotal = computed(() =>
  normalizedReportType.value.includes('contrib') || normalizedReportType.value.includes('desp')
)

const generateReport = async () => {
  try {
    if (!reportForm.type) {
      showToast('Selecione o tipo de relatorio.', 'danger')
      return
    }

    if ((reportForm.startDate && !reportForm.endDate) || (!reportForm.startDate && reportForm.endDate)) {
      showToast('Preencha a data inicial e a data final para gerar o relatório.', 'danger')
      return
    }

    if (reportForm.startDate && reportForm.endDate && reportForm.endDate < reportForm.startDate) {
      showToast('A data final não pode ser anterior à data inicial.', 'danger')
      return
    }

    reportRows.value = await api.get(
      `/relatorios?tipo=${encodeURIComponent(reportForm.type)}&inicio=${encodeURIComponent(reportForm.startDate)}&fim=${encodeURIComponent(reportForm.endDate)}`
    )
    generatedReportType.value = reportForm.type
    showToast(`Relatorio gerado com ${reportRows.value.length} registro(s).`, 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const printReport = () => {
  window.print()
}
</script>

<template>
  <section class="screen-panel report-panel report-page">
    <ReportPanel
      :form="reportForm"
      :report-type-options="reportTypeOptions"
      @generate="generateReport"
    />

    <section v-if="generatedReportType" class="report-result" aria-live="polite">
      <header class="report-result__header">
        <div>
          <h2>{{ reportTitle }}</h2>
          <p>Periodo: {{ periodLabel }}</p>
        </div>

        <button
          type="button"
          class="action-button action-button--secondary report-print-button"
          @click="printReport"
        >
          <AppIcon name="reportFile" />
          <span>Imprimir</span>
        </button>
      </header>

      <div v-if="reportRows.length" class="report-table-wrap">
        <table class="report-table">
          <thead>
            <tr>
              <th v-for="column in reportColumns" :key="column" scope="col">
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in reportRows" :key="row.id">
              <td v-for="column in reportColumns" :key="column">
                {{ getReportCellValue(row, column) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="report-empty">Nenhum registro encontrado para os filtros informados.</p>

      <footer class="report-summary">
        <span>Total de registros: {{ reportRows.length }}</span>
        <strong v-if="shouldShowTotal">Total: {{ formatCurrency(totalAmount) }}</strong>
      </footer>
    </section>
  </section>
</template>
