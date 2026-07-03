<script setup lang="ts">
import type { Todo } from '../types/todo'
import TodoItem from './TodoItem.vue'

defineProps<{ todos: Todo[] }>()
const emit = defineEmits<{
  toggle: [todo: Todo]
  remove: [todo: Todo]
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
        @toggle="emit('toggle', $event)"
        @remove="emit('remove', $event)"
      />
    </ul>
  </div>
</template>
