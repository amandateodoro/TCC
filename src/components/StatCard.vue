<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<template>
  <article class="stat-card">
    <div class="stat-card__title">
      <AppIcon :name="icon" />
      <span>{{ label }}</span>
    </div>
    <strong class="stat-card__value">{{ value }}</strong>
  </article>
</template>
