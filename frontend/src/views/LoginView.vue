<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginScreen from '../components/LoginScreen.vue'
import { useAuth } from '../composables/useAuth.js'
import { api, authToken } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const { setUser } = useAuth()

const authView = ref('login')
const loginForm = reactive({
  username: '',
  password: '',
  email: ''
})
const loginFeedback = ref('')

const login = async () => {
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    loginFeedback.value = 'Preencha usuário e senha para continuar.'
    return
  }

  try {
    const response = await api.post('/auth/login', {
      nomeDeUsuario: loginForm.username,
      senha: loginForm.password
    })

    authToken.set(response.accessToken)
    setUser(response.usuario)
    loginFeedback.value = ''
    authView.value = 'login'

    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      await router.replace(redirect)
      return
    }

    await router.replace({ name: 'dashboard' })
  } catch (error) {
    loginFeedback.value = error.message
  }
}

const openResetPassword = () => {
  authView.value = 'reset'
  loginFeedback.value = ''
}

const backToLogin = () => {
  authView.value = 'login'
  loginFeedback.value = ''
}

const sendResetLink = () => {
  if (!loginForm.email.trim()) {
    loginFeedback.value = 'Informe seu e-mail para continuar.'
    return
  }

  loginFeedback.value = 'Link de recuperação enviado com sucesso.'
}

onMounted(() => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.email = ''
})
</script>

<template>
  <LoginScreen
    :mode="authView"
    v-model:username="loginForm.username"
    v-model:password="loginForm.password"
    v-model:email="loginForm.email"
    :feedback="loginFeedback"
    @login="login"
    @forgot="openResetPassword"
    @back="backToLogin"
    @reset="sendResetLink"
  />
</template>