<template>
  <span :class="['flex items-center gap-2', `brand--${variant}`]" role="img" :aria-label="ariaLabel">
    <!-- SVG mark -->
    <svg :width="computedSize" :height="computedSize" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      class="brand-mark" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient :id="`grad-${uid}`" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" :stop-color="gradStart" />
          <stop offset="100%" :stop-color="gradEnd" />
        </linearGradient>
      </defs>

      <!-- rounded square base -->
      <rect x="10" y="10" width="180" height="180" rx="28" :fill="`url(#grad-${uid})`" />
      <!-- 'B' negative carved shape (two circles + connector) -->
      <g fill="#ffffff" opacity="0.95">
        <!-- top lobe cut -->
        <circle cx="95" cy="70" r="36" :fill="maskBackground" />
        <!-- bottom lobe cut -->
        <circle cx="95" cy="130" r="36" :fill="maskBackground" />
        <!-- connector -->
        <rect x="80" y="96" width="64" height="22" rx="11" :fill="maskBackground" />
      </g>

      <!-- subtle highlight -->
      <rect x="26" y="26" width="12" height="12" rx="3" :fill="highlightColor" opacity="0.08" />
    </svg>

    <!-- Wordmark -->
    <span class="" aria-hidden="false">
      <span class="font-bold text-xl font-heading">Borderless</span>
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | light | dark
  size: { type: [Number, String], default: 40 },
  tagline: { type: String, default: 'Money without limits' },
  ariaLabel: { type: String, default: 'Borderless — Money without limits' }
})

/* generate a UID so gradient ids don't collide when multiple components exist */
const uid = Math.random().toString(36).slice(2, 9)

/* color system */
const COLORS = {
  primary: { start: '#7C3AED', end: '#4C1D95', text: '#0F172A', highlight: '#ffffff' },
  light: { start: '#A78BFA', end: '#C4B5FD', text: '#111827', highlight: '#ffffff' },
  dark: { start: '#2E1065', end: '#1A063F', text: '#FFFFFF', highlight: '#FFFFFF' }
}

const variant = props.variant in COLORS ? props.variant : 'primary'

const gradStart = computed(() => COLORS[variant].start)
const gradEnd = computed(() => COLORS[variant].end)
const highlightColor = computed(() => COLORS[variant].highlight)

const maskBackground = computed(() => 'var(--surface-color, white)')

const computedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}` : props.size
)


const ariaLabel = props.ariaLabel
</script>

<style scoped></style>
