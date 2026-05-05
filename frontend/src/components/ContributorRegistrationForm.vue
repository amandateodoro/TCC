<script setup>
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

defineProps({
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <section class="screen-panel screen-panel--form">
    <div class="form-card">
      <div class="form-grid form-grid--contributor">
        <FormField v-model="form.fullName" label="Nome completo" placeholder="Nome" class="field-span-2" />
        <FormField v-model="form.address" label="Endereço" placeholder="Ex: Rua JK, n°..." class="field-span-2" />
        <FormField v-model="form.phone" label="Telefone" placeholder="(69)9 9999-9999" />
        <FormField
          v-model="form.birthDate"
          label="Data de nascimento"
          placeholder="dd/mm/aaaa"
          type="date"
        />
        <FormField v-model="form.profession" label="Profissão" placeholder="Profissão ou ocupação" />

        <label class="marriage-toggle">
          <input v-model="form.married" type="checkbox" />
          <span>Casado(a)</span>
        </label>

        <template v-if="form.married">
          <FormField
            v-model="form.spouseName"
            label="Nome do cônjuge"
            placeholder="Nome completo do cônjuge"
            class="field-span-2"
          />
          <FormField v-model="form.spousePhone" label="Telefone do cônjuge" placeholder="(69)9 9999-9999" />
          <FormField
            v-model="form.spouseBirthDate"
            label="Nascimento do cônjuge"
            placeholder="dd/mm/aaaa"
            type="date"
          />
        </template>
      </div>
    </div>

    <FormActions @save="emit('save')" @cancel="emit('cancel')" />
  </section>
</template>
