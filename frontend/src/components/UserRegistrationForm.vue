<script setup>
import FormActions from './FormActions.vue'
import FormField from './FormField.vue'

defineProps({
  form: {
    type: Object,
    required: true
  },
  editing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const accessOptions = ['Administrador', 'Secretaria']
</script>

<template>
  <section class="screen-panel screen-panel--form">
    <div class="form-card">
      <div class="form-grid form-grid--user">
        <FormField v-model="form.fullName" label="Nome completo" placeholder="Nome" class="field-span-2" />
        <FormField v-model="form.username" label="Nome de usuário" placeholder="usu123" />
        <FormField
          v-model="form.password"
          label="Senha"
          :placeholder="editing ? 'Deixe em branco para manter a senha' : '*******'"
          type="password"
          :toggle-password="true"
        />
        <FormField v-model="form.email" label="E-mail" placeholder="usuario@gmail.com" />
        <FormField
          v-model="form.accessLevel"
          label="Acesso do usuário:"
          placeholder="Nível de acesso"
          as="select"
          :options="accessOptions"
        />
        <FormField
          v-model="form.phone"
          label="Telefone"
          placeholder="(69) 99999-9999"
          phone-mask
        />
      </div>
    </div>

    <FormActions
      :save-label="editing ? 'Salvar alterações' : 'Salvar'"
      @save="emit('save')"
      @cancel="emit('cancel')"
    />
  </section>
</template>
