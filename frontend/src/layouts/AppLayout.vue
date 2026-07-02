<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import SidebarNav from '../components/SidebarNav.vue'
import TopBar from '../components/TopBar.vue'
import { useAuth } from '../composables/useAuth.js'
import { navigationItems, screenTitles } from '../config/navigation.js'

const route = useRoute()
const router = useRouter()
const { currentUser, clearSession } = useAuth()

const currentScreen = computed(() => route.name ?? 'dashboard')
const currentScreenTitle = computed(() => screenTitles[currentScreen.value] ?? currentScreen.value)

const logout = () => {
  clearSession()
  router.push({ name: 'login' })
}

const openProfile = () => {
  router.push({ name: 'profile' })
}
</script>

<template>
  <div class="app-shell">
    <SidebarNav
      :items="navigationItems"
      @logout="logout"
    />

    <div class="app-content">
      <TopBar
        :title="currentScreenTitle"
        :username="currentUser?.nomeDeUsuario ?? ''"
        :user-role="currentUser?.nivelAcesso ?? ''"
        @open-profile="openProfile"
      />

      <main class="dashboard-panel" :class="{ 'dashboard-panel--tight': currentScreen !== 'dashboard' }">
        <RouterView />
      </main>
    </div>
  </div>
</template>
