<script setup>
import AppIcon from './AppIcon.vue'

const emit = defineEmits(['open-profile'])
</script>

<template>
  <header class="topbar">
    <button type="button" class="profile-button" aria-label="Perfil do usuário" @click="emit('open-profile')">
      <AppIcon name="profile" />
    </button>
  </header>
</template>
