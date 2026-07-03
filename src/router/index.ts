import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import LoginView from '../pages/LoginView.vue'
import TodoView from '../pages/TodoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'todos', component: TodoView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
  ],
})

// 認証ガード：ログイン状態に応じてリダイレクト
router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data.session

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }   // 未ログインで保護ページ → ログインへ
  }
  if (to.name === 'login' && isLoggedIn) {
    return { name: 'todos' }   // ログイン済みでログイン画面 → TODOへ
  }
})

export default router
