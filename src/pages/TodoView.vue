<!-- 第8章で本格的に実装する仮のビュー -->
<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { user, signOut } = useAuth()
const router = useRouter()

async function handleLogout() {
  await signOut()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="p-4">
    <p>ログイン中：{{ user?.email }}</p>
    <button @click="handleLogout" class="border rounded px-3 py-1 mt-2">ログアウト</button>
    <p class="mt-4">TODO（第8章で実装）</p>
  </div>
</template>
