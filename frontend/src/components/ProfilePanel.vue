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
    <div class="profile-card">
      <div class="profile-card__hero">
        <div class="profile-card__avatar">{{ form.fullName.charAt(0) || 'U' }}</div>
        <div class="profile-card__intro">
          <h2>Meu perfil</h2>
          <p>Atualize suas informações pessoais e de acesso.</p>
        </div>
      </div>

      <div class="form-grid form-grid--user">
        <FormField v-model="form.fullName" label="Nome completo" placeholder="Nome completo" class="field-span-2" />
        <FormField v-model="form.username" label="Nome de usuário" placeholder="usu123" />
        <FormField v-model="form.email" label="E-mail" placeholder="usuario@gmail.com" />
        <FormField v-model="form.phone" label="Telefone" placeholder="(69)9 9999-9999" />
        <FormField
          v-model="form.accessLevel"
          label="Nível de acesso"
          placeholder="Selecione o nível"
          as="select"
          :options="['Administrador', 'Secretaria']"
        />
      </div>
    </div>

    <FormActions @save="emit('save')" @cancel="emit('cancel')" />
  </section>
</template>
