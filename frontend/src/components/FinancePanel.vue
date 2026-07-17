<script setup>
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

defineProps({
  variant: {
    type: String,
    default: 'contribution'
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
    default: () => []
  },
  contributionTypeOptions: {
    type: Array,
    default: () => []
  },
  contributorOptions: {
    type: Array,
    default: () => []
  },
  paymentMethodOptions: {
    type: Array,
    default: () => []
  },
  celebrationTypeOptions: {
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

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return value
}
</script>

<template>
  <section class="screen-panel finance-panel">
    <div class="form-card finance-card">
      <header class="form-card__header">
        <h2>Lançamento financeiro</h2>
        <p>Registre um novo lançamento e acompanhe os registros do dia.</p>
      </header>
      <div class="finance-form-grid" :class="`finance-form-grid--${variant}`">
        <template v-if="variant === 'contribution'">
          <FormField
            v-model="form.contributor"
            label="Contribuinte"
            placeholder="Nome do contribuinte"
            as="combobox"
            :list-options="contributorOptions"
            class="field-span-2"
          />
          <FormField
            v-model="form.contributionType"
            label="Tipo de contribuição"
            placeholder="Selecione o tipo"
            as="select"
            :options="contributionTypeOptions"
          />
          <FormField
            v-model="form.amount"
            label="Valor"
            placeholder="0,00"
            :currency-mask="true"
          />
          <FormField
            v-model="form.paymentMethod"
            label="Forma de pagamento"
            placeholder="Selecione a forma"
            as="select"
            :options="paymentMethodOptions"
            required
          />
          <FormField
            v-model="form.paymentDate"
            label="Data do pagamento"
            placeholder="dd/mm/aaaa"
            type="date"
          />
          <FormField
            v-model="form.observation"
            label="Observação"
            placeholder="Observação do lançamento"
            class="field-span-2"
          />
        </template>

        <template v-else-if="variant === 'offering'">
          <FormField
            v-model="form.totalAmount"
            label="Valor total arrecadado"
            placeholder="0,00"
            :currency-mask="true"
          />
          <FormField
            v-model="form.celebrationType"
            label="Tipo da celebração"
            placeholder="Selecione o tipo"
            as="select"
            :options="celebrationTypeOptions"
          />
          <FormField
            v-model="form.date"
            label="Data"
            placeholder="dd/mm/aaaa"
            type="date"
          />
          <FormField
            v-model="form.observation"
            label="Observação"
            placeholder="Observação da oferta"
            class="field-span-2"
          />
        </template>

        <template v-else>
          <FormField
            v-model="form.category"
            label="Categoria"
            placeholder="Selecione ou digite uma categoria"
            as="combobox"
            :list-options="categoryOptions"
          />
          <FormField
            v-model="form.observation"
            label="Observação"
            placeholder="Observação do lançamento"
          />
          <FormField
            v-model="form.amount"
            label="Valor"
            placeholder="0,00"
            :currency-mask="true"
          />
          <FormField
            v-model="form.date"
            label="Data"
            placeholder="dd/mm/aaaa"
            type="date"
          />
        </template>
      </div>

      <FormActions :save-label="actionLabel" @save="emit('save')" @cancel="emit('cancel')" />
    </div>

    <div class="finance-table-wrap">
      <p class="finance-table__title">{{ tableTitle }}</p>

      <div class="consultation-table finance-table">
        <div
          class="consultation-table__row consultation-table__row--finance consultation-table__row--head"
          :class="`consultation-table__row--finance-${variant}`"
        >
          <div v-if="variant === 'contribution'" class="consultation-table__cell">Contribuinte</div>
          <div v-if="variant === 'contribution'" class="consultation-table__cell">Valor</div>
          <div class="consultation-table__cell">Categoria</div>
          <div class="consultation-table__cell">Observação</div>
          <div class="consultation-table__cell">Data pagamento</div>
          <div v-if="variant !== 'contribution'" class="consultation-table__cell">Valor</div>
        </div>

        <div
          v-for="row in rows"
          :key="row.id"
          class="consultation-table__row consultation-table__row--finance"
          :class="`consultation-table__row--finance-${variant}`"
        >
          <div v-if="variant === 'contribution'" class="consultation-table__cell">{{ displayValue(row.contributor) }}</div>
          <div v-if="variant === 'contribution'" class="consultation-table__cell">{{ displayValue(row.amount) }}</div>
          <div class="consultation-table__cell">
            <span class="badge badge--category">{{ displayValue(row.category) }}</span>
          </div>
          <div class="consultation-table__cell">{{ displayValue(row.observation) }}</div>
          <div class="consultation-table__cell">{{ displayValue(row.paymentDate) }}</div>
          <div v-if="variant !== 'contribution'" class="consultation-table__cell">{{ displayValue(row.amount) }}</div>
        </div>
      </div>

      <p class="finance-table__total">{{ totalLabel }}</p>
    </div>
  </section>
</template>
