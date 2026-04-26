<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  items: {
    type: Array,
    required: true
  },
  currentScreen: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['navigate'])

const isGroupActive = (item, currentScreen) =>
  item.children?.some((child) => child.screen === currentScreen)
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__top">
      <div class="brand-card">
        <div class="brand-card__mark">
          <AppIcon name="church" />
        </div>
        <div>
          <strong>Comunidade</strong>
          <strong>São Pedro Chanel</strong>
          <span>Dízimo</span>
        </div>
      </div>

      <nav class="sidebar__nav" aria-label="Menu principal">
        <template v-for="item in items" :key="item.id">
          <div v-if="item.children" class="nav-group">
            <button
              type="button"
              class="nav-item"
              :class="{ 'nav-item--active': isGroupActive(item, currentScreen) }"
              @click="emit('navigate', item.children[0].screen)"
            >
              <AppIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </button>

            <div v-if="isGroupActive(item, currentScreen)" class="nav-submenu">
              <button
                v-for="child in item.children"
                :key="child.id"
                type="button"
                class="submenu-item"
                :class="{ 'submenu-item--active': child.screen === currentScreen }"
                @click="emit('navigate', child.screen)"
              >
                <span>{{ child.label }}</span>
              </button>
            </div>
          </div>

          <button
            v-else
            type="button"
            class="nav-item"
            :class="{ 'nav-item--active': item.screen === currentScreen }"
            @click="emit('navigate', item.screen)"
          >
            <AppIcon :name="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </template>
      </nav>
    </div>

    <button type="button" class="nav-item nav-item--logout">
      <AppIcon name="logout" />
      <span>Sair</span>
    </button>
  </aside>
</template>
