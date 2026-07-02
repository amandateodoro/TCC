<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppModal from '../components/AppModal.vue'
import ConsultationTable from '../components/ConsultationTable.vue'
import { showToast } from '../composables/useToast.js'
import { api } from '../services/api.js'

const router = useRouter()
const userSearch = ref('')
const users = ref([])
const selectedUser = ref(null)

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
  router.push({ name: 'user-edit', params: { id: row.id } })
}

const requestDeleteRow = (row) => {
  selectedUser.value = row
}

const cancelDeleteRow = () => {
  selectedUser.value = null
}

const confirmDeleteRow = async () => {
  if (!selectedUser.value) {
    return
  }

  const row = selectedUser.value

  try {
    await api.delete(`/usuarios/${row.id}`)
    await loadUsers()
    showToast(`${row.name} excluído com sucesso.`, 'success')
    cancelDeleteRow()
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
    @delete="requestDeleteRow"
  />

  <AppModal
    v-if="selectedUser"
    title="Excluir usuário"
    :subtitle="selectedUser.name"
    @close="cancelDeleteRow"
  >
    <p>Deseja realmente excluir este usuário?</p>

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
