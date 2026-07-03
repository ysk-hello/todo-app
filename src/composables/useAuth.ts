import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// モジュールスコープで状態を持つことで、アプリ全体で 1 つの認証状態を共有する
const user = ref<User | null>(null)
const loading = ref(true)
let initialized = false

export function useAuth() {
  // アプリ起動時に 1 回だけ呼ぶ。現在のセッションを取得し、以後の変化を監視する
  async function initialize() {
    if (initialized) return
    initialized = true

    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    loading.value = false

    // ログイン / ログアウトを検知して user を自動更新
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  // Google アカウントでログイン（OAuth）
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) throw error
  }

  // ログアウト
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { user, loading, initialize, signInWithGoogle, signOut }
}
