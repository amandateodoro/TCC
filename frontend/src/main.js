import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { useAuth } from './composables/useAuth.js'
import './vendor/toast/Toast.css'
import './styles.css'

const { restoreSession } = useAuth()
restoreSession()

createApp(App).use(router).mount('#app')
