<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  saveLabel: {
    type: String,
    default: 'Salvar'
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  }
})

const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <div class="form-actions">
    <button type="button" class="action-button action-button--compact" @click="emit('save')">
      <AppIcon name="plus" />
      <span>{{ saveLabel }}</span>
    </button>

    <button type="button" class="action-button action-button--compact" @click="emit('cancel')">
      <AppIcon name="cancel" />
      <span>{{ cancelLabel }}</span>
    </button>
  </div>
</template>
