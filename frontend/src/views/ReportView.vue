<script setup>
import { computed, reactive, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ReportPanel from '../components/ReportPanel.vue'
import { showToast } from '../composables/useToast.js'
import { reportTypeOptions } from '../config/options.js'
import { reportFormDefaults } from '../config/defaultValues.js'
import { formatCurrency, formatDate } from '../common/dataFormatters.js'
import { api } from '../services/api.js'

const reportForm = reactive({ ...reportFormDefaults })
const reportRows = ref([])
const generatedReportType = ref('')

const normalizedReportType = computed(() =>
  generatedReportType.value
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
)

const reportTitle = computed(() =>
  generatedReportType.value ? `Relatório de ${generatedReportType.value}` : 'Relatorio'
)

const isSaldoReport = computed(() => normalizedReportType.value.includes('saldo'))

const periodLabel = computed(() => {
  if (reportForm.startDate && reportForm.endDate) {
    return `${formatDate(reportForm.startDate)} a ${formatDate(reportForm.endDate)}`
  }

  if (
    normalizedReportType.value.includes('anivers') ||
    normalizedReportType.value.includes('entrada') ||
    normalizedReportType.value.includes('contrib') ||
    normalizedReportType.value.includes('saida') ||
    normalizedReportType.value.includes('desp') ||
    normalizedReportType.value.includes('saldo')
  ) {
    return 'Mês atual'
  }

  return 'Todos os registros'
})

const reportColumns = computed(() => {
  if (normalizedReportType.value.includes('entrada') || normalizedReportType.value.includes('contrib')) {
    return ['Origem', 'Nome Contribuinte / Tipo Celebração', 'Pagamento', 'Data', 'Valor', 'Observação']
  }

  if (normalizedReportType.value.includes('saida') || normalizedReportType.value.includes('desp')) {
    return ['Categoria', 'Descrição', 'Data', 'Valor']
  }

  if (isSaldoReport.value) {
    return ['Data', 'Contribuição voluntária', 'Dízimo', 'Oferta', 'Despesa', 'Saldo']
  }

  return ['Nome', 'Telefone', 'Data de nascimento']
})

const getReportCellValue = (row, column) => {
  const columnMap = {
    Origem: row.origem,
    Contribuinte: row.contribuinte?.nomeCompleto,
    Tipo: row.tipo,
    Pagamento: row.pagamento ?? row.formaDePagamento,
    Data: row.data
      ? formatDate(row.data)
      : row.dataDePagamento
      ? formatDate(row.dataDePagamento)
      : row.dataDespesa
        ? formatDate(row.dataDespesa)
        : '',
    Valor: row.valor
      ? formatCurrency(row.valor)
      : row.valorContribuicao
      ? formatCurrency(row.valorContribuicao)
      : row.valorDespesa
        ? formatCurrency(row.valorDespesa)
        : '',
    Observacao: row.observacao,
    'Observação': row.observacao,
    Categoria: row.categoria?.nome,
    Descricao: row.descricao ?? row.descricaoDespesa,
    'Descrição': row.descricao ?? row.descricaoDespesa,
    'Nome Contribuinte / Tipo Celebração': row.descricao,
    'Contribuição voluntária': formatCurrency(row.contribuicaoVoluntaria),
    Dízimo: formatCurrency(row.dizimo),
    Oferta: formatCurrency(row.oferta),
    Despesa: formatCurrency(row.despesa),
    Entradas: formatCurrency(row.entradas),
    Saidas: formatCurrency(row.saidas),
    'Saídas': formatCurrency(row.saidas),
    Saldo: formatCurrency(row.saldo),
    Nome: row.nomeCompleto,
    Telefone: row.telefone,
    'Data de nascimento': row.dataDeNascimento ? formatDate(row.dataDeNascimento) : ''
  }

  return columnMap[column] || '-'
}

const getReportSign = (row, column) => {
  if (!isSaldoReport.value) {
    return null
  }

  if (['Contribuição voluntária', 'Dízimo', 'Oferta'].includes(column)) {
    return {
      label: '(+)',
      className: 'report-sign report-sign--income'
    }
  }

  if (column === 'Despesa') {
    return {
      label: '(-)',
      className: 'report-sign report-sign--expense'
    }
  }

  return null
}

const totalAmount = computed(() =>
  reportRows.value.reduce(
    (total, row) => total + Number(row.saldo ?? row.valor ?? row.valorContribuicao ?? row.valorDespesa ?? 0),
    0
  )
)

const shouldShowTotal = computed(() =>
  normalizedReportType.value.includes('entrada') ||
  normalizedReportType.value.includes('contrib') ||
  normalizedReportType.value.includes('saida') ||
  normalizedReportType.value.includes('desp') ||
  normalizedReportType.value.includes('saldo')
)

const totalLabel = computed(() =>
  isSaldoReport.value ? 'Saldo total' : 'Total'
)

const countLabel = computed(() =>
  isSaldoReport.value ? 'Dias no relatório' : 'Total de registros'
)

const generateReport = async () => {
  try {
    if (!reportForm.type) {
      showToast('Selecione o tipo de relatório.', 'danger')
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
    showToast(`Relatório gerado com ${reportRows.value.length} registro(s).`, 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancelReport = () => {
  Object.assign(reportForm, reportFormDefaults)
  reportRows.value = []
  generatedReportType.value = ''
}

const downloadPdf = async () => {
  try {
    const params = new URLSearchParams({
      tipo: reportForm.type,
      inicio: reportForm.startDate,
      fim: reportForm.endDate
    })
    const blob = await api.getBlob(`/relatorios/pdf?${params.toString()}`)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `relatorio-${normalizedReportType.value || 'geral'}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    showToast('PDF gerado com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}
</script>

<template>
  <section class="screen-panel report-panel report-page">
    <ReportPanel
      :form="reportForm"
      :report-type-options="reportTypeOptions"
      @generate="generateReport"
      @cancel="cancelReport"
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
          @click="downloadPdf"
        >
          <AppIcon name="reportFile" />
          <span>Baixar PDF</span>
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
                <template v-if="getReportSign(row, column)">
                  <span :class="getReportSign(row, column).className">
                    {{ getReportSign(row, column).label }}
                  </span>
                  <span>{{ getReportCellValue(row, column) }}</span>
                </template>
                <span v-else>{{ getReportCellValue(row, column) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="report-empty">Nenhum registro encontrado para os filtros informados.</p>

      <footer class="report-summary">
        <span>{{ countLabel }}: {{ reportRows.length }}</span>
        <strong v-if="shouldShowTotal">{{ totalLabel }}: {{ formatCurrency(totalAmount) }}</strong>
      </footer>
    </section>
  </section>
</template>
