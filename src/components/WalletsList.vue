<template>
  <div class="relative w-full overflow-hidden">

    <h2 class="md:text-lg font-medium mb-2">Wallets</h2>

    <!-- Carousel Wrapper -->
    <div ref="carousel" class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }" @touchstart="startSwipe"
      @touchmove="swipeMove" @touchend="endSwipe">
      <div v-for="wallet in wallets" :key="wallet.currency" class="flex-shrink-0 px-2"
        :style="{ width: `${100 / slidesPerView}%` }">
        <WalletCard :wallet="wallet" :highlight="wallet.currency === 'USDT'" />
      </div>
    </div>

    <!-- Indicators -->
    <div class="flex justify-center mt-4 space-x-2">
      <span v-for="(_, index) in totalPages" :key="index" class="h-2 rounded transition-all duration-300 cursor-pointer"
        :class="currentIndex === index ? 'bg-primary w-4' : 'bg-gray-300 dark:bg-gray-600 w-2'"
        @click="goToSlide(index)"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from "vue"
import WalletCard from '@/components/WalletCard.vue'

const props = defineProps({
  wallets: { type: Array, required: true }
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

const totalPages = computed(() => Math.ceil(props.wallets.length / slidesPerView.value))

const updateSlidesPerView = () => {
  if (window.innerWidth >= 768) slidesPerView.value = 3
  else if (window.innerWidth >= 640) slidesPerView.value = 2
  else slidesPerView.value = 1
}

// Watch slidesPerView and wallets length to clamp currentIndex
watch([slidesPerView, () => props.wallets.length], () => {
  nextTick(() => {
    const maxIndex = totalPages.value - 1
    if (currentIndex.value > maxIndex) currentIndex.value = maxIndex
  })
})

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener("resize", debouncedResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedResize)
})

const debouncedResize = debounce(updateSlidesPerView)

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
  if (!isSwiping.value) {
    startX.value = 0
    endX.value = 0
    return
  }

  const deltaX = startX.value - endX.value

  if (deltaX > 50 && currentIndex.value < totalPages.value - 1) currentIndex.value++
  else if (deltaX < -50 && currentIndex.value > 0) currentIndex.value--

  startX.value = 0
  endX.value = 0
  isSwiping.value = false
}

// --- Indicator click ---
const goToSlide = (index) => {
  if (index >= 0 && index < totalPages.value) currentIndex.value = index
}

// --- Watch for wallets changes to clamp index ---
watch(
  () => props.wallets.length,
  () => {
    if (currentIndex.value > totalPages.value - 1) currentIndex.value = totalPages.value - 1
  }
)
</script>
