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
  <article class="kpi-card">
    <div class="kpi-card__info">
      <span class="kpi-card__label">{{ label }}</span>
      <strong class="kpi-card__value">{{ value }}</strong>
    </div>
    <span class="kpi-card__icon">
      <AppIcon :name="icon" />
    </span>
  </article>
</template>