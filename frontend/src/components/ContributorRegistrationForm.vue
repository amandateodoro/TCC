<script setup>
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

defineProps({
  form: {
    type: Object,
    required: true
  },
  professionOptions: {
    type: Array,
    default: () => []
  },
  editing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel', 'profession-search'])
</script>

<template>
  <section class="screen-panel screen-panel--form">
    <div class="form-card">
      <header class="form-card__header">
        <h2>Dados do contribuinte</h2>
        <p>Preencha as informacoes para cadastrar um novo contribuinte.</p>
      </header>
      <div class="form-grid form-grid--contributor">
        <FormField v-model="form.fullName" label="Nome completo" placeholder="Nome" class="field-span-2" />
        <FormField v-model="form.address" label="Endereço" placeholder="Ex: Rua JK, n°..." class="field-span-2" />
        <FormField
          v-model="form.phone"
          label="Telefone"
          placeholder="(69) 99999-9999"
          phone-mask
        />
        <FormField
          v-model="form.birthDate"
          label="Data de nascimento"
          placeholder="dd/mm/aaaa"
          type="date"
        />
        <FormField
          v-model="form.profession"
          label="Profissão"
          placeholder="Digite para buscar uma profissão"
          as="combobox"
          :list-options="professionOptions"
          required
          @update:model-value="emit('profession-search', $event)"
        />

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
            required
          />
          <FormField
            v-model="form.spousePhone"
            label="Telefone do cônjuge"
            placeholder="(69) 99999-9999"
            phone-mask
            required
          />
          <FormField
            v-model="form.spouseBirthDate"
            label="Nascimento do cônjuge"
            placeholder="dd/mm/aaaa"
            type="date"
            required
          />
          <FormField
            v-model="form.spouseProfession"
            label="Profissão do cônjuge"
            placeholder="Digite para buscar uma profissão"
            as="combobox"
            :list-options="professionOptions"
            required
            @update:model-value="emit('profession-search', $event)"
          />
        </template>
      </div>
    </div>

    <FormActions
      :save-label="editing ? 'Salvar alterações' : 'Salvar'"
      @save="emit('save')"
      @cancel="emit('cancel')"
    />
  </section>
</template>
