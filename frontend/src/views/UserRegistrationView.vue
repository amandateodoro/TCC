<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserRegistrationForm from '../components/UserRegistrationForm.vue'
import { showToast } from '../composables/useToast.js'
import { REQUIRED_FIELDS_MESSAGE, userFormDefaults } from '../config/defaultValues.js'
import { api } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const userForm = reactive({ ...userFormDefaults })
const editingId = computed(() => route.params.id)
const isEditing = computed(() => Boolean(editingId.value))

const resetForm = () => {
  Object.assign(userForm, userFormDefaults)
}

const fillForm = (user) => {
  Object.assign(userForm, {
    fullName: user.nomeCompleto ?? '',
    username: user.nomeDeUsuario ?? '',
    password: '',
    email: user.email ?? '',
    accessLevel: user.nivelAcesso ?? '',
    phone: user.telefone ?? ''
  })
}

const loadUser = async () => {
  if (!isEditing.value) {
    resetForm()
    return
  }

  const user = await api.get(`/usuarios/${editingId.value}`)
  fillForm(user)
}

const save = async () => {
  const requiredFields = [
    userForm.fullName,
    userForm.username,
    userForm.password,
    userForm.email,
    userForm.phone,
    userForm.accessLevel
  ]

  if (!isEditing.value && requiredFields.some((value) => !String(value).trim())) {
    showToast(REQUIRED_FIELDS_MESSAGE, 'danger')
    return
  }

  try {
    const payload = {
      nomeCompleto: userForm.fullName,
      nomeDeUsuario: userForm.username,
      email: userForm.email,
      nivelAcesso: userForm.accessLevel,
      telefone: userForm.phone
    }

    if (isEditing.value) {
      if (userForm.password) {
        payload.senha = userForm.password
      }
      await api.patch(`/usuarios/${editingId.value}`, payload)
      showToast('Usuário atualizado com sucesso.', 'success')
    } else {
      payload.senha = userForm.password
      await api.post('/usuarios', payload)
      showToast('Usuário salvo com sucesso.', 'success')
    }

    resetForm()
    router.push({ name: 'user-consultation' })
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  resetForm()

  if (isEditing.value) {
    router.push({ name: 'user-consultation' })
    return
  }

  showToast('Formulário limpo.')
}

onMounted(async () => {
  try {
    await loadUser()
  } catch (error) {
    showToast(error.message, 'danger')
    router.push({ name: 'user-consultation' })
  }
})
</script>

<template>
  <UserRegistrationForm
    :form="userForm"
    :editing="isEditing"
    @save="save"
    @cancel="cancel"
  />
</template>
