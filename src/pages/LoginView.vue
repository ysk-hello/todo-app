<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { signInWithGoogle } = useAuth()
const errorMessage = ref<string | null>(null)

async function handleLogin() {
  errorMessage.value = null
  try {
    await signInWithGoogle()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'ログインに失敗しました'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-8">My TODO App</h1>

      <button
        type="button"
        @click="handleLogin"
        class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <!-- ここに Google のロゴ SVG を置く（誌面では省略） -->
        Googleでログイン
      </button>

      <p v-if="errorMessage" class="mt-4 text-sm text-red-600">{{ errorMessage }}</p>
    </div>
  </div>
</template>
