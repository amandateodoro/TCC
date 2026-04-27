<script setup>
import { ref } from 'vue'
import crossIcon from '../assets/icons/cruz.png'
import heroImage from '../assets/login-hero.jpg'

defineProps({
  mode: {
    type: String,
    default: 'login'
  },
  username: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:username',
  'update:password',
  'update:email',
  'login',
  'forgot',
  'back',
  'reset'
])

const showPassword = ref(false)
</script>

<template>
  <section class="login-shell">
    <div class="login-card">
      <div class="login-panel">
        <div class="login-brand">
          <div class="login-brand__mark">
            <img :src="crossIcon" alt="" />
          </div>
          <div class="login-brand__text">
            <span>Comunidade</span>
            <strong>São Pedro Chanel</strong>
          </div>
        </div>

        <template v-if="mode === 'reset'">
          <button type="button" class="login-back" @click="emit('back')">&lt; Voltar</button>

          <div class="login-copy login-copy--reset">
            <h1>Redefinir senha</h1>
            <p>
              Informe seu e-mail e enviaremos um link para recuperação da sua senha
            </p>
          </div>

          <form class="login-form login-form--reset" @submit.prevent="emit('reset')">
            <label class="login-form__field login-form__field--icon">
              <span class="login-form__field-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4 7h16v10H4zM4 8l8 6 8-6"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                  />
                </svg>
              </span>
              <input
                :value="email"
                type="email"
                placeholder="E-mail"
                @input="emit('update:email', $event.target.value)"
              />
            </label>

            <button type="submit" class="login-form__submit login-form__submit--reset">Enviar link</button>
          </form>
        </template>

        <template v-else>
          <div class="login-copy">
            <p class="login-copy__eyebrow">Bem-vindo</p>
            <h1>Acesse o sistema da comunidade</h1>
            <p>
              Entre com seus dados para acompanhar contribuições, cadastros e relatórios.
            </p>
          </div>

          <form class="login-form" @submit.prevent="emit('login')">
            <label class="login-form__field">
              <input
                :value="username"
                type="text"
                placeholder="Nome de Usuário"
                @input="emit('update:username', $event.target.value)"
              />
            </label>

            <label class="login-form__field login-form__field--password">
              <input
                :value="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                @input="emit('update:password', $event.target.value)"
              />
              <button
                type="button"
                class="login-form__toggle-password"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 6.5 20 19.5M9.3 9.1A4 4 0 0 0 15 14.7M10.6 5.4A10.8 10.8 0 0 1 12 5.3c5.2 0 8.7 4.7 9.6 6a1.1 1.1 0 0 1 0 1.3 17.1 17.1 0 0 1-3.8 3.8M6.2 8.1a17 17 0 0 0-3.8 3.2 1.1 1.1 0 0 0 0 1.3c1 1.4 4.4 6 9.6 6a10 10 0 0 0 2.4-.3"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M2.4 12.6a1.1 1.1 0 0 1 0-1.3c1-1.4 4.4-6 9.6-6s8.7 4.7 9.6 6a1.1 1.1 0 0 1 0 1.3c-1 1.4-4.4 6-9.6 6s-8.7-4.7-9.6-6ZM12 15.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                  />
                </svg>
              </button>
            </label>

            <button type="button" class="login-form__forgot" @click="emit('forgot')">Esqueci minha senha</button>
            <button type="submit" class="login-form__submit">Entrar</button>
          </form>
        </template>

        <p v-if="feedback" class="login-form__feedback">{{ feedback }}</p>
      </div>

      <div class="login-hero">
        <img :src="heroImage" alt="Cruz em destaque no interior da igreja" />
        <div class="login-hero__overlay"></div>
      </div>
    </div>
  </section>
</template>
