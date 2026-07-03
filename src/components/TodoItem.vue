<script setup lang="ts">
import type { Todo } from '../types/todo'

defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  toggle: [todo: Todo]
  remove: [todo: Todo]
}>()
</script>

<template>
  <li class="flex items-center gap-3 bg-white rounded-lg shadow-sm px-3 py-2">
    <input
      type="checkbox"
      :checked="todo.is_completed"
      @change="emit('toggle', todo)"
      class="w-5 h-5 accent-blue-500 cursor-pointer"
    />
    <span class="flex-1 break-words" :class="todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'">
      {{ todo.title }}
    </span>
    <button @click="emit('remove', todo)" title="削除" class="text-red-400 hover:text-red-600 text-lg">🗑</button>
  </li>
</template>
