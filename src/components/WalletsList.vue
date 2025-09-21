<template>
  <div class="relative w-full overflow-hidden">

    <!-- Carousel Wrapper -->
    <div ref="carousel" class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${(currentIndex * 100) / slidesPerView}%)` }" @touchstart="startSwipe"
      @touchmove="swipeMove" @touchend="endSwipe">
      <div v-for="wallet in wallets" :key="wallet.currency" class="flex-shrink-0 px-2"
        :style="{ width: `${100 / slidesPerView}%` }">
        <WalletCard :wallet="wallet" :highlight="wallet.currency === 'USDT'" :currencies="currencies" />
      </div>
    </div>

    <!-- Indicators -->
    <div class="flex justify-center mt-4 space-x-2">
      <span v-for="index in totalPages" :key="index" class="h-2 rounded transition-all duration-300 cursor-pointer"
        :class="currentIndex === index - 1 ? 'bg-primary w-4' : 'bg-gray-300 dark:bg-gray-600 w-2'"
        @click="goToSlide(index - 1)"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from "vue"
import WalletCard from '@/components/WalletCard.vue'

const props = defineProps({
  wallets: { type: Array, required: true },
  currencies: { type: Array }
})

const currentIndex = ref(0)
const slidesPerView = ref(1)

// Swipe state
const startX = ref(0)
const endX = ref(0)
const isSwiping = ref(false)

// --- Debounce helper ---
let resizeTimeout
const debounce = (fn, delay = 50) => (...args) => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => fn(...args), delay)
}

// --- Update slides per view based on screen width ---
const updateSlidesPerView = () => {
  if (window.innerWidth >= 1024) slidesPerView.value = 3
  else if (window.innerWidth >= 768) slidesPerView.value = 3
  else if (window.innerWidth >= 640) slidesPerView.value = 2
  else slidesPerView.value = 1
  clampIndex()
}

// --- Total pages for indicators (scrollable positions) ---
const totalPages = computed(() => Math.max(props.wallets.length - slidesPerView.value + 1, 1))

// --- Clamp index so carousel never overflows ---
const clampIndex = () => {
  nextTick(() => {
    const maxIndex = Math.max(props.wallets.length - slidesPerView.value, 0)
    if (currentIndex.value > maxIndex) currentIndex.value = maxIndex
  })
}

// --- Swipe logic ---
const startSwipe = (e) => {
  startX.value = e.touches[0].clientX
  endX.value = startX.value
  isSwiping.value = false
}

const swipeMove = (e) => {
  endX.value = e.touches[0].clientX
  if (Math.abs(endX.value - startX.value) > 10) isSwiping.value = true
}

const endSwipe = () => {
  if (!isSwiping.value) return
  const deltaX = startX.value - endX.value
  if (deltaX > 50 && currentIndex.value < props.wallets.length - slidesPerView.value) currentIndex.value++
  else if (deltaX < -50 && currentIndex.value > 0) currentIndex.value--
  startX.value = 0
  endX.value = 0
  isSwiping.value = false
}

// --- Go to slide when indicator clicked ---
const goToSlide = (index) => {
  if (index >= 0 && index <= props.wallets.length - slidesPerView.value) {
    currentIndex.value = index
  }
}

// --- Handle resize ---
const debouncedResize = debounce(updateSlidesPerView)

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener("resize", debouncedResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedResize)
})

// --- Watch wallets length and clamp index ---
watch(() => props.wallets.length, () => clampIndex())
</script>
