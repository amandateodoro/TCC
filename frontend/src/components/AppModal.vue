<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div class="app-modal" @click.self="$emit('close')">
        <div class="app-modal__dialog" role="dialog" aria-modal="true" :aria-label="title">
          <header class="app-modal__header">
            <div>
              <h2 class="app-modal__title">{{ title }}</h2>
              <p v-if="subtitle" class="app-modal__subtitle">{{ subtitle }}</p>
            </div>
            <button
              type="button"
              class="app-modal__close"
              aria-label="Fechar"
              @click="$emit('close')"
            >
              <AppIcon name="cancel" />
            </button>
          </header>

          <div class="app-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="app-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
