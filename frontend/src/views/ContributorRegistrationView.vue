<script setup>
import { reactive } from 'vue'
import ContributorRegistrationForm from '../components/ContributorRegistrationForm.vue'
import { useAuth } from '../composables/useAuth.js'
import { showToast } from '../composables/useToast.js'
import { contributorFormMock } from '../mock/appData.js'
import { api } from '../services/api.js'

const { currentUser } = useAuth()

const contributorForm = reactive({ ...contributorFormMock })

const resetForm = () => {
  Object.assign(contributorForm, contributorFormMock)
}

const save = async () => {
  try {
    await api.post('/contribuintes', {
      nomeCompleto: contributorForm.fullName,
      endereco: contributorForm.address,
      telefone: contributorForm.phone,
      dataDeNascimento: contributorForm.birthDate || undefined,
      profissaoNome: contributorForm.profession,
      casado: contributorForm.married,
      nomeConjuge: contributorForm.spouseName || undefined,
      telefoneConjuge: contributorForm.spousePhone || undefined,
      dataNascimentoConjuge: contributorForm.spouseBirthDate || undefined,
      usuarioCadastroId: currentUser.value?.id
    })
    resetForm()
    showToast('Contribuinte salvo com sucesso.', 'success')
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
  <ContributorRegistrationForm
    :form="contributorForm"
    @save="save"
    @cancel="cancel"
  />
</template>
