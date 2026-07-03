<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ add: [title: string] }>()
const title = ref('')

function submit() {
  if (!title.value.trim()) return
  emit('add', title.value)
  title.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="flex gap-2 mb-4">
    <input
      v-model="title"
      type="text"
      placeholder="新しいTODOを入力..."
      class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button type="submit" class="bg-blue-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600 transition">
      追加
    </button>
  </form>
</template>
