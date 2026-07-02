<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  values: {
    type: Array,
    required: true
  }
})

const canvas = ref(null)
let chart = null

const render = () => {
  if (!canvas.value) {
    return
  }

  if (chart) {
    chart.destroy()
  }

  const ctx = canvas.value.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 240)
  gradient.addColorStop(0, 'rgba(173, 136, 102, 0.35)')
  gradient.addColorStop(1, 'rgba(173, 136, 102, 0)')

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [{
        data: props.values,
        borderColor: '#945a22',
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => `R$ ${value}` }
        }
      }
    }
  })
}

onMounted(render)
watch(() => [props.labels, props.values], render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <article class="chart-card chart-card--wide">
    <h3 class="chart-card__title">Arrecadação nos últimos 6 meses</h3>
    <div class="chart-card__body chart-card__body--line">
      <canvas ref="canvas"></canvas>
    </div>
  </article>
</template>
