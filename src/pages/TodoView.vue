<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTodos } from '../composables/useTodos'
import TodoInput from '../components/TodoInput.vue'
import TodoList from '../components/TodoList.vue'

const router = useRouter()
const { user, signOut } = useAuth()

// 認証ガードを通過しているので user は必ず存在する
const { todos, loading, errorMessage, fetchTodos, addTodo, toggleTodo, removeTodo, attachImage, getImageUrl, subscribeRealtime, unsubscribeRealtime } =
  useTodos(user.value!.id)

onMounted(async () => {
  await fetchTodos()
  subscribeRealtime() // 表示時に購読開始
})

onUnmounted(() => {
  unsubscribeRealtime() // 離脱時に購読解除
})

async function handleLogout() {
  await signOut()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 class="text-lg font-bold text-gray-800">My TODO App</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 truncate max-w-[140px]">{{ user?.email }}</span>
          <button @click="handleLogout" class="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition">
            ログアウト
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-xl mx-auto p-4">
      <TodoInput @add="addTodo" />
      <p v-if="errorMessage" class="text-sm text-red-600 mb-3">{{ errorMessage }}</p>
      <p v-if="loading" class="text-center text-gray-400 py-10">読み込み中...</p>
      <TodoList v-else :todos="todos" :get-image-url="getImageUrl" @toggle="toggleTodo" @remove="removeTodo" @attach="attachImage" />
    </main>
  </div>
</template>
