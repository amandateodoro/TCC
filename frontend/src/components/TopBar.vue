<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: ''
  },
  userRole: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['open-profile'])

const today = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
})

const userInitials = computed(() => {
  const value = props.username.trim()

  if (!value) {
    return '?'
  }

  const segments = value.split(/[._\s-]+/).filter(Boolean)

  if (segments.length >= 2) {
    return `${segments[0][0]}${segments[1][0]}`.toUpperCase()
  }

  return value.slice(0, 2).toUpperCase()
})
</script>

<template>
  <header class="topbar">
    <div class="topbar__heading">
      <h1 class="topbar__title">{{ title }}</h1>
      <p class="topbar__date">{{ today }}</p>
    </div>
    <div class="topbar__actions">
      <button type="button" class="topbar__bell" aria-label="Notificacoes">
        <AppIcon name="bell" />
      </button>
      <button
        type="button"
        class="profile-button"
        :aria-label="`Perfil de ${username || 'usuario'}`"
        @click="emit('open-profile')"
      >
        <span class="profile-button__avatar">{{ userInitials }}</span>
        <span class="profile-button__text">
          <span class="profile-button__name">{{ username }}</span>
          <span class="profile-button__role">{{ userRole }}</span>
        </span>
      </button>
    </div>
  </header>
</template>
