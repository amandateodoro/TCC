<script setup>
import registerIcon from '../assets/icons/adicionar-usuario.png'
import homeIcon from '../assets/icons/botao-de-inicio.png'
import crossIcon from '../assets/icons/cruz.png'
import profileIcon from '../assets/icons/do-utilizador.png'
import editIcon from '../assets/icons/editar.png'
import reportIcon from '../assets/icons/jornal.png'
import trashIcon from '../assets/icons/lixeira-xmark.png'
import logoutIcon from '../assets/icons/sair.png'
import moneyIcon from '../assets/icons/mao-segurando-usd.png'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <img
    v-if="props.name === 'church'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="crossIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'home'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="homeIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'userPlus'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="registerIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'edit'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="editIcon"
    alt=""
  />

  <svg
    v-else-if="props.name === 'search'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm8 14-4.35-4.35"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <img
    v-else-if="props.name === 'trash'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="trashIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'money' || props.name === 'currency'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="moneyIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'report'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="reportIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'reportFile'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="reportIcon"
    alt=""
  />

  <img
    v-else-if="props.name === 'logout'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="logoutIcon"
    alt=""
  />

  <svg
    v-else-if="props.name === 'user'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <svg
    v-else-if="props.name === 'gift'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M4 9h16v4H4zM6 13h12v7H6zM12 9v11M8.5 9c-1.4 0-2.5-1-2.5-2.2S7.1 4.5 8.5 4.5c2.1 0 3.5 3 3.5 4.5M15.5 9c1.4 0 2.5-1 2.5-2.2s-1.1-2.3-2.5-2.3c-2.1 0-3.5 3-3.5 4.5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.6"
    />
  </svg>

  <svg
    v-else-if="props.name === 'plus'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <svg
    v-else-if="props.name === 'cancel'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Zm-3.5-6.5 7-7m0 7-7-7"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <img
    v-else-if="props.name === 'profile'"
    aria-hidden="true"
    class="app-icon app-icon--image"
    :src="profileIcon"
    alt=""
  />
</template>
