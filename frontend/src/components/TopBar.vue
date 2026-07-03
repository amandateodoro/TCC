<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
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
</script>

<template>
  <header class="topbar">
    <div class="topbar__heading">
      <h1 class="topbar__title">{{ title }}</h1>
      <p class="topbar__date">{{ today }}</p>
    </div>
    <div class="topbar__actions">
      <button
        type="button"
        class="profile-button"
        :aria-label="`Perfil de ${username || 'usuário'}`"
        @click="emit('open-profile')"
      >
        <span class="profile-button__avatar">
          <AppIcon name="profile" />
        </span>
        <span class="profile-button__text">
          <span class="profile-button__name">{{ username }}</span>
          <span class="profile-button__role">{{ userRole }}</span>
        </span>
      </button>
    </div>
  </header>
</template>
