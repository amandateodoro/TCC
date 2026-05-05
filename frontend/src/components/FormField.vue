<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Boolean],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  as: {
    type: String,
    default: 'input'
  },
  options: {
    type: Array,
    default: () => []
  },
  numericOnly: {
    type: Boolean,
    default: false
  },
  currencyMask: {
    type: Boolean,
    default: false
  },
  togglePassword: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const showPassword = ref(false)

const formatCurrencyValue = (value) => {
  const digits = value.replace(/\D+/g, '')

  if (!digits) {
    return ''
  }

  const cents = digits.padStart(3, '0')
  const integerPart = cents.slice(0, -2).replace(/^0+(?=\d)/, '') || '0'
  const decimalPart = cents.slice(-2)

  return `${integerPart},${decimalPart}`
}

const handleInput = (event) => {
  const nextValue = props.currencyMask
    ? formatCurrencyValue(event.target.value)
    : props.numericOnly
      ? event.target.value
          .replace(/[^\d,]/g, '')
          .replace(/,(?=.*,)/g, '')
      : event.target.value

  if ((props.numericOnly || props.currencyMask) && event.target.value !== nextValue) {
    event.target.value = nextValue
  }

  emit('update:modelValue', nextValue)
}
</script>

<template>
  <label class="form-field" :class="{ 'form-field--select': as === 'select' }">
    <span class="form-field__label">{{ label }}</span>

    <div v-if="as === 'select'" class="form-select-wrap">
      <select
        class="form-control form-control--select"
        :class="{ 'form-control--empty': !modelValue }"
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span class="form-select-wrap__arrow" aria-hidden="true"></span>
    </div>

    <div v-else-if="type === 'date'" class="form-date-wrap">
      <input
        class="form-control form-control--date"
        :class="{ 'form-control--date-empty': !modelValue }"
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <span v-if="!modelValue" class="form-date-wrap__placeholder">{{ placeholder }}</span>
    </div>

    <input
      v-else-if="type !== 'password' || !togglePassword"
      class="form-control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :inputmode="currencyMask ? 'decimal' : numericOnly ? 'numeric' : undefined"
      @input="handleInput"
    />

    <div v-else class="form-password-wrap">
      <input
        class="form-control form-control--password"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
      />
      <button
        type="button"
        class="form-password-wrap__toggle"
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
    </div>
  </label>
</template>
