<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  birthdays: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section class="birthdays-card">
    <div class="birthdays-card__header">
      <AppIcon name="gift" />
      <h2>Aniversariantes do Mês:</h2>
    </div>

    <ul class="birthdays-list">
      <li v-for="person in birthdays" :key="person.id" class="birthday-row">
        <span class="birthday-row__name">{{ person.name }}</span>
        <span class="birthday-row__date">{{ person.date }}</span>
      </li>
    </ul>
  </section>
</template>
