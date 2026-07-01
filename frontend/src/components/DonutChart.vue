<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    required: true
  }
})

const canvas = ref(null)
let chart = null

const hasValues = computed(() => props.data.some((value) => Number(value) > 0))

const chartData = computed(() => {
  if (hasValues.value) {
    return props.data
  }

  const count = Math.max(props.labels.length, props.data.length, 2)
  return Array(count).fill(1)
})

const render = () => {
  if (!canvas.value) {
    return
  }

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(canvas.value, {
    type: 'doughnut',
    data: {
      labels: props.labels,
      datasets: [{ data: chartData.value, backgroundColor: props.colors, borderWidth: 0 }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })
}

onMounted(render)
watch(() => [chartData.value, props.labels, props.colors], render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <article class="chart-card">
    <h3 class="chart-card__title">{{ title }}</h3>
    <div class="chart-card__body chart-card__body--donut">
      <div class="chart-card__canvas">
        <canvas ref="canvas"></canvas>
      </div>
      <ul class="chart-legend">
        <li v-for="(label, index) in labels" :key="label" class="chart-legend__item">
          <span class="chart-legend__dot" :style="{ background: colors[index] }"></span>
          <span>{{ label }}<template v-if="!hasValues">: 0</template></span>
        </li>
      </ul>
    </div>
  </article>
</template>
