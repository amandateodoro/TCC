<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'plus'
  }
})
</script>

<template>
  <button type="button" class="action-button">
    <AppIcon :name="icon" />
    <span>{{ label }}</span>
  </button>
</template>
