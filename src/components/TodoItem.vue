<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
  getImageUrl: (path: string) => Promise<string | null>
}>()
const emit = defineEmits<{
  toggle: [todo: Todo]
  remove: [todo: Todo]
  attach: [todo: Todo, file: File]
}>()

const imageUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// image_path が変わったら署名付き URL を取得し直す
watch(
  () => props.todo.image_path,
  async (path) => {
    imageUrl.value = path ? await props.getImageUrl(path) : null
  },
  { immediate: true }
)

function openFileDialog() {
  fileInput.value?.click()
}
function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) emit('attach', props.todo, file)
  ;(event.target as HTMLInputElement).value = '' // 同じファイルを再選択可能に
}
</script>

<template>
  <li class="flex items-center gap-3 bg-white rounded-lg shadow-sm px-3 py-2">
    <input type="checkbox" :checked="todo.is_completed" @change="emit('toggle', todo)"
      class="w-5 h-5 shrink-0 accent-blue-500 cursor-pointer" />

    <span class="flex-1 break-words" :class="todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'">
      {{ todo.title }}
    </span>

    <img v-if="imageUrl" :src="imageUrl" alt="添付画像" class="w-10 h-10 object-cover rounded shrink-0" />

    <button type="button" @click="openFileDialog" title="画像を添付" class="shrink-0 text-gray-500 hover:text-gray-700 text-lg">📎</button>
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    <button type="button" @click="emit('remove', todo)" title="削除" class="shrink-0 text-red-400 hover:text-red-600 text-lg">🗑</button>
  </li>
</template>
