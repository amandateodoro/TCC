<script setup>
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
  }
})

const emit = defineEmits(['update:modelValue'])

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
      v-else
      class="form-control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :inputmode="currencyMask ? 'decimal' : numericOnly ? 'numeric' : undefined"
      @input="handleInput"
    />
  </label>
</template>
