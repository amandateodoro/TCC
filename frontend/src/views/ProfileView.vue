<script setup>
import { onMounted, reactive } from 'vue'
import ProfilePanel from '../components/ProfilePanel.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import { api } from '../services/api.js'

const { currentUser, updateUser } = useAuth()

const profileForm = reactive({
  fullName: '',
  username: '',
  email: '',
  phone: '',
  accessLevel: ''
})

const syncProfileForm = () => {
  const user = currentUser.value

  if (!user) {
    return
  }

  Object.assign(profileForm, {
    fullName: user.nomeCompleto,
    username: user.nomeDeUsuario,
    email: user.email,
    phone: user.telefone ?? '',
    accessLevel: user.nivelAcesso
  })
}

const save = async () => {
  if (!currentUser.value?.id) {
    showToast('Faça login novamente para atualizar o perfil.', 'danger')
    return
  }

  try {
    const updated = await api.patch(`/usuarios/${currentUser.value.id}`, {
      nomeCompleto: profileForm.fullName,
      nomeDeUsuario: profileForm.username,
      email: profileForm.email,
      telefone: profileForm.phone,
      nivelAcesso: profileForm.accessLevel
    })

    updateUser(updated)
    showToast('Perfil salvo com sucesso.', 'success')
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  syncProfileForm()
  showToast('Perfil restaurado.')
}

onMounted(() => {
  syncProfileForm()
})
</script>

<template>
  <ProfilePanel
    :form="profileForm"
    @save="save"
    @cancel="cancel"
  />
</template>
