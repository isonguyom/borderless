<script setup>
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import { ref } from 'vue'

const inputValue = ref('')
const selectValue = ref('')
const showModal = ref(false)
const toastRef = ref(null)

function handleAction() {
  toastRef.value.trigger('Action completed!', 'success')
}
</script>

<template>
  <div class="space-y-4 p-6">
    <BaseButton @click="showModal = true">Open Modal</BaseButton>
    <BaseInput v-model="inputValue" placeholder="Enter text" />
    <BaseSelect v-model="selectValue" :options="[{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]" />

    <BaseModal :show="showModal" title="Demo Modal" @close="showModal = false">
      <p>This is modal content.</p>
      <BaseButton @click="handleAction">Confirm</BaseButton>
    </BaseModal>

    <BaseToast ref="toastRef" />
  </div>
</template>
