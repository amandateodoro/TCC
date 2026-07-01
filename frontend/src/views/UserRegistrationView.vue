<script setup>
import { reactive } from 'vue'
import UserRegistrationForm from '../components/UserRegistrationForm.vue'
import { showToast } from '../composables/useToast.js'
import { userFormMock } from '../mock/appData.js'
import { api } from '../services/api.js'

const userForm = reactive({ ...userFormMock })

const resetForm = () => {
  Object.assign(userForm, userFormMock)
}

const save = async () => {
  try {
    await api.post('/usuarios', {
      nomeCompleto: userForm.fullName,
      nomeDeUsuario: userForm.username,
      senha: userForm.password,
      email: userForm.email,
      nivelAcesso: userForm.accessLevel,
      telefone: userForm.phone
    })
    resetForm()
    showToast('Usuário salvo com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  resetForm()
  showToast('Formulário limpo.')
}
</script>

<template>
  <UserRegistrationForm
    :form="userForm"
    @save="save"
    @cancel="cancel"
  />
</template>
