<script setup>
import ActionButton from './ActionButton.vue'
import AppIcon from './AppIcon.vue'
import FormField from './FormField.vue'

defineProps({
  form: {
    type: Object,
    required: true
  },
  reportTypeOptions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['generate', 'cancel'])
</script>

<template>
  <section class="screen-panel report-panel">
    <div class="form-card report-card">
      <header class="form-card__header">
        <h2>Gerar relatório</h2>
        <p>Selecione o tipo e o período desejado.</p>
      </header>
      <div class="report-grid">
        <FormField
          v-model="form.type"
          label="Tipo de relatório"
          placeholder="Selecione o tipo"
          as="select"
          :options="reportTypeOptions"
        />
        <FormField
          v-model="form.startDate"
          label="Início"
          placeholder="dd/mm/aaaa"
          type="date"
        />
        <FormField
          v-model="form.endDate"
          label="Fim"
          placeholder="dd/mm/aaaa"
          type="date"
        />
      </div>

      <div class="report-action">
        <ActionButton label="Gerar Relatório" icon="reportFile" @click="emit('generate')" />
        <button type="button" class="action-button" @click="emit('cancel')">
          <AppIcon name="cancel" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  </section>
</template>
