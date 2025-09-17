<template>
  <button type="button" @click="toggleDarkMode" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="">
    <i :class="['bi', isDark ? 'bi-sun' : 'bi-moon',]"></i>
    <slot />
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue"

const isDark = ref(false)
const emit = defineEmits(["toggle"])

// Sync with system preference + storage
const syncDarkModeWithStorage = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const storedTheme = localStorage.getItem("theme")

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark")
    isDark.value = true
  } else {
    document.documentElement.classList.remove("dark")
    isDark.value = false
  }
}

// Toggle theme
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    localStorage.setItem("theme", "dark")
    document.documentElement.classList.add("dark")
  } else {
    localStorage.setItem("theme", "light")
    document.documentElement.classList.remove("dark")
  }
  emit("toggle", isDark.value)
}

// Watch for external changes (e.g., another tab changes theme)
window.addEventListener("storage", (e) => {
  if (e.key === "theme") {
    syncDarkModeWithStorage()
    emit("toggle", isDark.value)
  }
})

// Watch for system preference changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
mediaQuery.addEventListener("change", () => {
  if (!localStorage.getItem("theme")) {
    syncDarkModeWithStorage()
    emit("toggle", isDark.value)
  }
})

onMounted(() => {
  syncDarkModeWithStorage()
})
</script>
