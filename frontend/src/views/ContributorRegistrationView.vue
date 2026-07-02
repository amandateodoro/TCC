<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContributorRegistrationForm from '../components/ContributorRegistrationForm.vue'
import { showToast } from '../composables/useToast.js'
import { contributorFormDefaults } from '../forms/defaultValues.js'
import { api } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const contributorForm = reactive({ ...contributorFormDefaults })
const professions = ref([])
const editingId = computed(() => route.params.id)
const isEditing = computed(() => Boolean(editingId.value))

const professionOptions = computed(() =>
  professions.value.map((profession) => profession.nome)
)

const resetForm = () => {
  Object.assign(contributorForm, contributorFormDefaults)
}

const toDateInput = (value) => value?.slice(0, 10) ?? ''

const mergeProfessions = (items = []) => {
  const merged = new Map(professions.value.map((profession) => [profession.id, profession]))
  items.filter(Boolean).forEach((profession) => merged.set(profession.id, profession))
  professions.value = [...merged.values()]
}

const loadProfessions = async (search = '') => {
  const result = await api.get(`/profissoes?search=${encodeURIComponent(search)}&limit=20`)
  mergeProfessions(result)
}

const searchProfessions = (search) => {
  if (search.trim().length < 2) {
    return
  }

  loadProfessions(search).catch((error) => {
    showToast(error.message, 'danger')
  })
}

const findProfessionId = (name) => {
  const profession = professions.value.find(
    (item) => item.nome.trim().toLowerCase() === name.trim().toLowerCase()
  )

  return profession?.id
}

const fillForm = (contributor) => {
  mergeProfessions([
    ...(contributor.profissoes ?? []),
    ...(contributor.conjuge?.profissoes ?? [])
  ])

  Object.assign(contributorForm, {
    fullName: contributor.nomeCompleto ?? '',
    address: contributor.endereco ?? '',
    phone: contributor.telefone ?? '',
    birthDate: toDateInput(contributor.dataDeNascimento),
    profession: contributor.profissoes?.[0]?.nome ?? '',
    married: Boolean(contributor.casado),
    spouseName: contributor.conjuge?.nomeCompleto ?? '',
    spousePhone: contributor.conjuge?.telefone ?? '',
    spouseBirthDate: toDateInput(contributor.conjuge?.dataDeNascimento),
    spouseProfession: contributor.conjuge?.profissoes?.[0]?.nome ?? ''
  })
}

const loadContributor = async () => {
  await loadProfessions()

  if (!isEditing.value) {
    resetForm()
    return
  }

  const contributor = await api.get(`/contribuintes/${editingId.value}`)
  fillForm(contributor)
}

const buildPayload = () => {
  const professionId = findProfessionId(contributorForm.profession)
  const spouseProfessionId = findProfessionId(contributorForm.spouseProfession)

  if (!professionId) {
    throw new Error('Selecione uma profissão cadastrada.')
  }

  if (contributorForm.married && !spouseProfessionId) {
    throw new Error('Selecione uma profissão cadastrada para o cônjuge.')
  }

  return {
    nomeCompleto: contributorForm.fullName,
    endereco: contributorForm.address,
    telefone: contributorForm.phone,
    dataDeNascimento: contributorForm.birthDate || undefined,
    profissaoIds: [professionId],
    casado: contributorForm.married,
    nomeConjuge: contributorForm.spouseName || undefined,
    telefoneConjuge: contributorForm.spousePhone || undefined,
    dataNascimentoConjuge: contributorForm.spouseBirthDate || undefined,
    profissaoConjugeIds: spouseProfessionId ? [spouseProfessionId] : undefined
  }
}

const save = async () => {
  try {
    const payload = buildPayload()

    if (isEditing.value) {
      await api.patch(`/contribuintes/${editingId.value}`, payload)
      showToast('Contribuinte atualizado com sucesso.', 'success')
    } else {
      await api.post('/contribuintes', payload)
      showToast('Contribuinte salvo com sucesso.', 'success')
    }

    resetForm()
    router.push({ name: 'contributor-consultation' })
  } catch (error) {
    showToast(error.message, 'danger')
  }
}

const cancel = () => {
  resetForm()

  if (isEditing.value) {
    router.push({ name: 'contributor-consultation' })
    return
  }

  showToast('Formulário limpo.')
}

onMounted(async () => {
  try {
    await loadContributor()
  } catch (error) {
    showToast(error.message, 'danger')
    router.push({ name: 'contributor-consultation' })
  }
})
</script>

<template>
  <ContributorRegistrationForm
    :form="contributorForm"
    :editing="isEditing"
    :profession-options="professionOptions"
    @profession-search="searchProfessions"
    @save="save"
    @cancel="cancel"
  />
</template>
