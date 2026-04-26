<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <svg
    v-if="props.name === 'church'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M11 2h2v3h3v2h-3v3h-2V7H8V5h3zM8 10h8a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2h-3v-6H10v6H7a2 2 0 0 1-2-2v-7a3 3 0 0 1 3-3Z"
      fill="currentColor"
    />
  </svg>

  <svg
    v-else-if="props.name === 'home'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="m4 11 8-6 8 6M6 10.5V20h4v-5h4v5h4v-9.5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <svg
    v-else-if="props.name === 'userPlus'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5 19a5 5 0 0 1 10 0M19 8v6M16 11h6"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <svg
    v-else-if="props.name === 'edit'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M4 20h4l10-10-4-4L4 16v4ZM13.5 6.5l4 4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

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

  <svg
    v-else-if="props.name === 'trash'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M5 7h14M9 7V5h6v2m-7 3v8m4-8v8m4-8v8M7 7l1 13h8l1-13"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.7"
    />
  </svg>

  <svg
    v-else-if="props.name === 'money' || props.name === 'currency'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M13.5 4H11a3 3 0 1 0 0 6h2a3 3 0 1 1 0 6H10M12 2v2m0 16v2"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <svg
    v-else-if="props.name === 'report'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 1v5h5M9 13h6M9 17h6"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

  <svg
    v-else-if="props.name === 'reportFile'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 1v5h5M9 13h6M9 17h4"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.7"
    />
  </svg>

  <svg
    v-else-if="props.name === 'logout'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M10 17v1a2 2 0 0 0 2 2h5M15 12H4m0 0 3-3m-3 3 3 3M14 4h3a2 2 0 0 1 2 2v2"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
    />
  </svg>

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

  <svg
    v-else-if="props.name === 'profile'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="app-icon"
  >
    <path
      d="M12 13a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 13Zm0 2c-3.6 0-6.6 2-7.8 5h15.6c-1.2-3-4.2-5-7.8-5Z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.6"
    />
  </svg>
</template>
