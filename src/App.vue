<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { initialize } = useAuth()
onMounted(initialize)
</script>

<template>
  <RouterView />
</template>
