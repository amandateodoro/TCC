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
  <section class="events-card">
    <header class="events-card__header">
      <div class="events-card__title">
        <AppIcon name="gift" />
        <h2>Aniversariantes do Mês</h2>
      </div>
    </header>

    <ul class="events-list">
      <li v-for="person in birthdays" :key="person.id" class="events-list__item">
        <div class="events-list__info">
          <strong>{{ person.name }}</strong>
          <span>{{ person.date }}</span>
        </div>
      </li>
      <li v-if="!birthdays.length" class="events-list__empty">
        Nenhum aniversariante neste mês.
      </li>
    </ul>
  </section>
</template>