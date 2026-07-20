<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppModal from '../components/AppModal.vue'
import ConsultationTable from '../components/ConsultationTable.vue'
import { showToast } from '../composables/useToast.js'
import { formatDate } from '../common/dataFormatters.js'
import { api } from '../services/api.js'

const router = useRouter()
const contributorSearch = ref('')
const contributors = ref([])
const selectedContributor = ref(null)

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
  router.push({ name: 'contributor-edit', params: { id: row.id } })
}

const requestDeleteRow = (row) => {
  selectedContributor.value = row
}

const cancelDeleteRow = () => {
  selectedContributor.value = null
}

const confirmDeleteRow = async () => {
  if (!selectedContributor.value) {
    return
  }

  const row = selectedContributor.value

  try {
    await api.delete(`/contribuintes/${row.id}`)
    await loadContributors()
    showToast(`${row.name} excluído com sucesso.`, 'success')
    cancelDeleteRow()
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
    @delete="requestDeleteRow"
  />

  <AppModal
    v-if="selectedContributor"
    title="Excluir contribuinte"
    :subtitle="selectedContributor.name"
    @close="cancelDeleteRow"
  >
    <p>Deseja realmente excluir este contribuinte?</p>

    <template #footer>
      <div class="form-actions">
        <button type="button" class="action-button action-button--compact action-button--secondary" @click="cancelDeleteRow">
          Cancelar
        </button>
        <button type="button" class="action-button action-button--compact action-button--danger" @click="confirmDeleteRow">
          Excluir
        </button>
      </div>
    </template>
  </AppModal>
</template>
