<script setup>
defineProps({
  type: { type: String, required: true },       // Wallet currency type e.g. "USDT"
  batch: { type: String, default: 'Batch A' },  // Wallet batch
  balance: { type: Number, required: true },    // Wallet balance
  equivalent: { type: String, default: '' },    // Dollar or local currency equivalent
  highlight: { type: Boolean, default: false }  // Optional highlight style
})
</script>

<template>
  <div
    class="p-6 rounded-2xl shadow-md border transition hover:shadow-lg hover:-translate-y-1 duration-200"
    :class="highlight ? 'bg-primary text-white' : 'bg-white text-gray-900'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-bold">
          {{ type }}
          <span class="ml-1 text-sm font-normal opacity-70">· {{ batch }}</span>
        </h3>
      </div>
      <i
        class="bi bi-wallet2 text-2xl"
        :class="highlight ? 'text-white/90' : 'text-primary'"
      ></i>
    </div>

    <!-- Balance -->
    <p class="text-2xl font-extrabold tracking-tight mb-1">
      {{ balance.toLocaleString() }} {{ type }}
    </p>
    <p
      class="text-sm"
      :class="highlight ? 'text-white/70' : 'text-gray-500'"
    >
      ≈ {{ equivalent }}
    </p>
  </div>
</template>
