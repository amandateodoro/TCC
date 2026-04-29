<script setup>
import ActionButton from './ActionButton.vue'
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

const emit = defineEmits(['generate'])
</script>

<template>
  <section class="screen-panel report-panel">
    <div class="form-card report-card">
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
      </div>
    </div>
  </section>
</template>
