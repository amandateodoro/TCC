<script setup>
import { computed, onMounted, ref } from 'vue'
import ConsultationTable from '../components/ConsultationTable.vue'
import { showToast } from '../composables/useToast.js'
import { api, formatDate } from '../services/api.js'

const contributorSearch = ref('')
const contributors = ref([])

const contributorConsultationHeaders = [
  { key: 'name', label: 'Nome' },
  { key: 'phone', label: 'Telefone' },
  { key: 'birthDate', label: 'Data de Nascimento' }
]

const consultationContributorRows = computed(() =>
  contributors.value.map((contributor) => ({
    id: contributor.id,
    name: contributor.nomeCompleto,
    phone: contributor.telefone ?? '',
    birthDate: formatDate(contributor.dataDeNascimento)
  }))
)

const filteredContributorRows = computed(() =>
  consultationContributorRows.value.filter((row) =>
    row.name.toLowerCase().includes(contributorSearch.value.trim().toLowerCase())
  )
)

const loadContributors = async () => {
  contributors.value = await api.get('/contribuintes')
}

const editRow = (row) => {
  showToast(`Edição de ${row.name} ainda será conectada em uma próxima etapa.`, 'warning')
}

const deleteRow = async (row) => {
  try {
    await api.delete(`/contribuintes/${row.id}`)
    await loadContributors()
    showToast(`${row.name} excluído com sucesso.`, 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

onMounted(async () => {
  try {
    await loadContributors()
  } catch (error) {
    showToast(error.message, 'danger')
  }
})
</script>

<template>
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
