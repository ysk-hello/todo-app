<script setup lang="ts">
import type { Todo } from '../types/todo'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: Todo[]
  getImageUrl: (path: string) => Promise<string | null>
}>()
const emit = defineEmits<{
  toggle: [todo: Todo]
  remove: [todo: Todo]
  attach: [todo: Todo, file: File]
}>()
</script>

<template>
  <div>
    <p v-if="todos.length === 0" class="text-center text-gray-400 py-10">まだTODOがありません</p>
    <ul v-else class="space-y-2">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :get-image-url="getImageUrl"
        @toggle="emit('toggle', $event)"
        @remove="emit('remove', $event)"
        @attach="(t, f) => emit('attach', t, f)"
      />
    </ul>
  </div>
</template>
