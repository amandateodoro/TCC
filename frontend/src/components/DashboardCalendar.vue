<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import AppModal from './AppModal.vue'
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const reference = new Date()
const localEvents = ref([])
const hoveredDay = ref(null)
const modalOpen = ref(false)
const selectedDay = ref(null)
const eventName = ref('')
let nextCustomId = 1

watch(
  () => props.events,
  (events) => {
    const customEvents = localEvents.value.filter((event) => event.custom)
    localEvents.value = [
      ...events.map((event) => ({ ...event, custom: false })),
      ...customEvents
    ]
  },
  { immediate: true, deep: true }
)

const monthLabel = computed(() =>
  reference.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
)

const modalDateLabel = computed(() => {
  if (!selectedDay.value) {
    return ''
  }

  const date = new Date(reference.getFullYear(), reference.getMonth(), selectedDay.value)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
})

const eventsByDay = computed(() => {
  const map = new Map()

  localEvents.value.forEach((event) => {
    const dayEvents = map.get(event.day) ?? []
    dayEvents.push(event)
    map.set(event.day, dayEvents)
  })

  return map
})

const days = computed(() => {
  const year = reference.getFullYear()
  const month = reference.getMonth()
  const firstWeekDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstWeekDay }, () => null)

  for (let day = 1; day <= totalDays; day += 1) {
    const dayEvents = eventsByDay.value.get(day) ?? []
    cells.push({
      day,
      events: dayEvents,
      hasEvent: dayEvents.length > 0
    })
  }

  return cells
})

const openModal = (day) => {
  selectedDay.value = day
  eventName.value = ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedDay.value = null
  eventName.value = ''
}

const saveEvent = () => {
  const label = eventName.value.trim()

  if (!label || !selectedDay.value) {
    return
  }

  localEvents.value.push({
    id: `custom-${nextCustomId}`,
    day: selectedDay.value,
    label,
    custom: true
  })
  nextCustomId += 1
  closeModal()
}
</script>

<template>
  <article class="calendar-card">
    <header class="calendar-card__header">
      <h3>{{ monthLabel }}</h3>
      <AppIcon name="calendar" />
    </header>
    <div class="calendar-grid calendar-grid--head">
      <span v-for="(label, index) in weekDays" :key="index">{{ label }}</span>
    </div>
    <div class="calendar-grid calendar-grid--body">
      <template v-for="(cell, index) in days" :key="index">
        <span v-if="!cell" class="calendar-cell calendar-cell--empty" />

        <div
          v-else
          class="calendar-cell"
          :class="{ 'calendar-cell--event': cell.hasEvent }"
          @mouseenter="hoveredDay = cell.day"
          @mouseleave="hoveredDay = null"
        >
          <span class="calendar-cell__day">{{ cell.day }}</span>

          <ul v-if="cell.events.length" class="calendar-cell__events">
            <li
              v-for="event in cell.events.slice(0, 2)"
              :key="event.id"
              class="calendar-cell__event"
              :title="event.label"
            >
              {{ event.label }}
            </li>
            <li v-if="cell.events.length > 2" class="calendar-cell__event calendar-cell__event--more">
              +{{ cell.events.length - 2 }}
            </li>
          </ul>

          <button
            type="button"
            class="calendar-cell__add"
            :class="{ 'calendar-cell__add--visible': hoveredDay === cell.day }"
            aria-label="Adicionar evento"
            @click="openModal(cell.day)"
          >
            <AppIcon name="plus" :size="14" />
          </button>
        </div>
      </template>
    </div>

    <AppModal
      v-if="modalOpen"
      title="Novo evento"
      :subtitle="modalDateLabel"
      @close="closeModal"
    >
      <FormField
        v-model="eventName"
        label="Nome do evento"
        placeholder="Ex: Reuniao de lideranca"
      />

      <template #footer>
        <FormActions save-label="Adicionar" @save="saveEvent" @cancel="closeModal" />
      </template>
    </AppModal>
  </article>
</template>
