<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  searchLabel: {
    type: String,
    required: true
  },
  searchPlaceholder: {
    type: String,
    required: true
  },
  tableTitle: {
    type: String,
    required: true
  },
  headers: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  query: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'user'
  }
})

const emit = defineEmits(['update:query', 'edit', 'delete'])
const nameSortDirection = ref(null)

const sortedRows = computed(() => {
  if (!props.headers.some((header) => header.key === 'name')) {
    return props.rows
  }

  const rows = [...props.rows]
  rows.sort((left, right) => {
    const result = left.name.localeCompare(right.name, 'pt-BR', { numeric: true, sensitivity: 'base' })
    return nameSortDirection.value === 'desc' ? -result : result
  })
  return rows
})

const toggleNameSort = () => {
  nameSortDirection.value = nameSortDirection.value === 'asc' ? 'desc' : 'asc'
}
</script>

<template>
  <section class="screen-panel consultation-panel">
    <div class="consultation-search">
      <label class="consultation-search__label">{{ searchLabel }}</label>
      <div class="consultation-search__field">
        <input
          class="consultation-search__input"
          :value="query"
          :placeholder="searchPlaceholder"
          @input="emit('update:query', $event.target.value)"
        />
        <button type="button" class="consultation-search__button" aria-label="Pesquisar">
          <AppIcon name="search" />
        </button>
      </div>
    </div>

    <div class="consultation-table-wrap">
      <p class="consultation-table__title">{{ tableTitle }}</p>

      <div class="consultation-table">
        <div
          class="consultation-table__row consultation-table__row--head"
          :class="`consultation-table__row--${variant}`"
        >
          <div
            v-for="header in headers"
            :key="header.key"
            class="consultation-table__cell"
            :class="header.className"
          >
            <button
              v-if="header.key === 'name'"
              type="button"
              class="consultation-table__sort-button"
              @click="toggleNameSort"
            >
              <span>{{ header.label }}</span>
              <span class="consultation-table__sort-indicator">
                {{ nameSortDirection === 'desc' ? 'Z-A' : 'A-Z' }}
              </span>
            </button>
            <span v-else>{{ header.label }}</span>
          </div>
          <div class="consultation-table__cell consultation-table__cell--actions"></div>
        </div>

        <div
          v-for="row in sortedRows"
          :key="row.id"
          class="consultation-table__row"
          :class="`consultation-table__row--${variant}`"
        >
          <div
            v-for="header in headers"
            :key="`${row.id}-${header.key}`"
            class="consultation-table__cell"
            :class="header.className"
          >
            {{ row[header.key] }}
          </div>
          <div class="consultation-table__cell consultation-table__cell--actions">
            <button type="button" class="icon-action" :aria-label="`Editar ${row.name}`" @click="emit('edit', row)">
              <AppIcon name="edit" />
            </button>
            <button type="button" class="icon-action" :aria-label="`Excluir ${row.name}`" @click="emit('delete', row)">
              <AppIcon name="trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
