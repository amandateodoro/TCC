<script setup>
import { reactive } from 'vue'
import ReportPanel from '../components/ReportPanel.vue'
import { showToast } from '../composables/useToast.js'
import { reportTypeOptions } from '../config/options.js'
import { reportFormDefaults } from '../forms/defaultValues.js'
import { api } from '../services/api.js'

const reportForm = reactive({ ...reportFormDefaults })

const generateReport = async () => {
  try {
    const reportRows = await api.get(
      `/relatorios?tipo=${encodeURIComponent(reportForm.type)}&inicio=${encodeURIComponent(reportForm.startDate)}&fim=${encodeURIComponent(reportForm.endDate)}`
    )
    showToast(`Relatório gerado com ${reportRows.length} registro(s).`, 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}
</script>

<template>
  <ReportPanel
    :form="reportForm"
    :report-type-options="reportTypeOptions"
    @generate="generateReport"
  />
</template>
