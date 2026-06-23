<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['open-profile'])

const displayName = computed(() =>
  props.user?.nomeDeUsuario || props.user?.nomeCompleto || 'Usuario'
)

const accessLevel = computed(() => props.user?.nivelAcesso || 'Perfil')

const initials = computed(() => {
  const name = displayName.value.trim()
  const parts = name.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
})
</script>

<template>
  <header class="topbar">
    <button type="button" class="profile-button" aria-label="Perfil do usuario" @click="emit('open-profile')">
      <span class="profile-button__avatar" aria-hidden="true">{{ initials }}</span>
      <span class="profile-button__text">
        <span class="profile-button__name">{{ displayName }}</span>
        <span class="profile-button__role">{{ accessLevel }}</span>
      </span>
    </button>
  </header>
</template>
