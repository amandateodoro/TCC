<script setup>
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

defineProps({
  form: {
    type: Object,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  categoryOptions: {
    type: Array,
    required: true
  },
  actionLabel: {
    type: String,
    default: 'Adicionar'
  },
  tableTitle: {
    type: String,
    required: true
  },
  totalLabel: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <section class="screen-panel finance-panel">
    <div class="form-card finance-card">
      <div class="finance-form-grid">
        <FormField
          v-model="form.category"
          label=""
          placeholder="Categoria"
          as="select"
          :options="categoryOptions"
        />
        <FormField v-model="form.description" label="" placeholder="Descrição" />
        <FormField v-model="form.amount" label="" placeholder="Valor" />
        <FormField v-model="form.date" label="" placeholder="Data" />
      </div>

      <FormActions :save-label="actionLabel" @save="emit('save')" @cancel="emit('cancel')" />
    </div>

    <div class="finance-table-wrap">
      <p class="finance-table__title">{{ tableTitle }}</p>

      <div class="consultation-table finance-table">
        <div class="consultation-table__row consultation-table__row--finance consultation-table__row--head">
          <div class="consultation-table__cell consultation-table__cell--check">
            <input type="checkbox" aria-label="Selecionar todos" />
          </div>
          <div class="consultation-table__cell">Categoria</div>
          <div class="consultation-table__cell">Descrição</div>
          <div class="consultation-table__cell">Data pagamento</div>
          <div class="consultation-table__cell">Valor</div>
        </div>

        <div
          v-for="row in rows"
          :key="row.id"
          class="consultation-table__row consultation-table__row--finance"
        >
          <div class="consultation-table__cell consultation-table__cell--check">
            <input type="checkbox" :aria-label="`Selecionar ${row.category}`" />
          </div>
          <div class="consultation-table__cell">{{ row.category }}</div>
          <div class="consultation-table__cell">{{ row.description }}</div>
          <div class="consultation-table__cell">{{ row.paymentDate }}</div>
          <div class="consultation-table__cell">{{ row.amount }}</div>
        </div>
      </div>

      <p class="finance-table__total">{{ totalLabel }}</p>
    </div>
  </section>
</template>
