<script setup>
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

defineProps({
  variant: {
    type: String,
    default: 'expense'
  },
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
  contributionTypeOptions: {
    type: Array,
    default: () => []
  },
  paymentMethodOptions: {
    type: Array,
    default: () => []
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
      <div class="finance-form-grid" :class="`finance-form-grid--${variant}`">
        <template v-if="variant === 'income'">
          <FormField
            v-model="form.contributor"
            label=""
            placeholder="Contribuinte"
            class="field-span-2"
          />
          <FormField
            v-model="form.contributionType"
            label=""
            placeholder="Tipo de Contribuição"
            as="select"
            :options="contributionTypeOptions"
          />
          <FormField v-model="form.amount" label="" placeholder="Valor" :currency-mask="true" />
          <FormField
            v-model="form.paymentMethod"
            label=""
            placeholder="Forma de pagamento"
            as="select"
            :options="paymentMethodOptions"
          />
          <FormField
            v-model="form.paymentDate"
            label=""
            placeholder="Data"
            type="date"
          />
        </template>

        <template v-else>
          <FormField
            v-model="form.category"
            label=""
            placeholder="Categoria"
            as="select"
            :options="categoryOptions"
          />
          <FormField v-model="form.description" label="" placeholder="Descrição" />
          <FormField v-model="form.amount" label="" placeholder="Valor" :currency-mask="true" />
          <FormField v-model="form.date" label="" placeholder="Data" type="date" />
        </template>
      </div>

      <FormActions :save-label="actionLabel" @save="emit('save')" @cancel="emit('cancel')" />
    </div>

    <div class="finance-table-wrap">
      <p class="finance-table__title">{{ tableTitle }}</p>

      <div class="consultation-table finance-table">
        <div class="consultation-table__row consultation-table__row--finance consultation-table__row--head">
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
