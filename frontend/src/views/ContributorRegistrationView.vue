<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContributorRegistrationForm from '../components/ContributorRegistrationForm.vue'
import { showToast } from '../composables/useToast.js'
import { contributorFormDefaults, REQUIRED_FIELDS_MESSAGE } from '../config/defaultValues.js'
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
    throw new Error(REQUIRED_FIELDS_MESSAGE)
  }

  if (contributorForm.married && !spouseProfessionId) {
    throw new Error(REQUIRED_FIELDS_MESSAGE)
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
  const requiredFields = [
    contributorForm.fullName,
    contributorForm.address,
    contributorForm.phone,
    contributorForm.birthDate,
    contributorForm.profession
  ]

  if (contributorForm.married) {
    requiredFields.push(
      contributorForm.spouseName,
      contributorForm.spousePhone,
      contributorForm.spouseBirthDate,
      contributorForm.spouseProfession
    )
  }

  if (!isEditing.value && requiredFields.some((value) => !String(value).trim())) {
    showToast(REQUIRED_FIELDS_MESSAGE, 'danger')
    return
  }

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
