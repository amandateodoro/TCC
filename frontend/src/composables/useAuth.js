import { computed, ref } from 'vue'
import { authToken } from '../services/api.js'

const STORAGE_KEY = 'tcc-auth-user'

const currentUser = ref(null)

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null && !!authToken.get())

  const restoreSession = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY)

    if (!stored || !authToken.get()) {
      if (stored) {
        sessionStorage.removeItem(STORAGE_KEY)
      }
      return
    }

    try {
      currentUser.value = JSON.parse(stored)
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  const setUser = (user) => {
    currentUser.value = user
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }

  const updateUser = (user) => {
    setUser(user)
  }

  const clearSession = () => {
    currentUser.value = null
    sessionStorage.removeItem(STORAGE_KEY)
    authToken.clear()
  }

  return {
    currentUser,
    isAuthenticated,
    restoreSession,
    setUser,
    updateUser,
    clearSession
  }
}