<script setup>
import { computed, onMounted, ref } from 'vue'
import ConsultationTable from '../components/ConsultationTable.vue'
import { showToast } from '../composables/useToast.js'
import { api } from '../services/api.js'

const userSearch = ref('')
const users = ref([])

const userConsultationHeaders = [
  { key: 'name', label: 'Nome' },
  { key: 'phone', label: 'Telefone' },
  { key: 'birthDate', label: 'Data de Nascimento' },
  { key: 'accessLevel', label: 'Nível de Acesso' }
]

const consultationUserRows = computed(() =>
  users.value.map((user) => ({
    id: user.id,
    name: user.nomeCompleto,
    phone: user.telefone ?? '',
    birthDate: '',
    accessLevel: user.nivelAcesso
  }))
)

const filteredUserRows = computed(() =>
  consultationUserRows.value.filter((row) =>
    row.name.toLowerCase().includes(userSearch.value.trim().toLowerCase())
  )
)

const loadUsers = async () => {
  users.value = await api.get('/usuarios')
}

const editRow = (row) => {
  showToast(`Edição de ${row.name} ainda será conectada em uma próxima etapa.`, 'warning')
}

const deleteRow = async (row) => {
  try {
    await api.delete(`/usuarios/${row.id}`)
    await loadUsers()
    showToast(`${row.name} excluído com sucesso.`, 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

onMounted(async () => {
  try {
    await loadUsers()
  } catch (error) {
    showToast(error.message, 'danger')
  }
})
</script>

<template>
  <ConsultationTable
    v-model:query="userSearch"
    variant="user"
    search-label="Digite o nome do usuário"
    search-placeholder="Nome"
    table-title="Usuários cadastrados:"
    :headers="userConsultationHeaders"
    :rows="filteredUserRows"
    @edit="editRow"
    @delete="deleteRow"
  />
</template>
