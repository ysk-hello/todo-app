import { ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js' // 次章で使用
import { supabase } from '../lib/supabase'
import type { Todo } from '../types/todo'

const BUCKET = 'todo-images'
// 署名付き URL の有効期限（秒）。ここでは 1 時間。
const SIGNED_URL_EXPIRES = 60 * 60

export function useTodos(userId: string) {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  // Read：一覧取得
  async function fetchTodos() {
    loading.value = true
    errorMessage.value = null
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) errorMessage.value = error.message
    else todos.value = (data as Todo[]) ?? []
    loading.value = false
  }

  // Create：追加
  async function addTodo(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return
    const { error } = await supabase
      .from('todos')
      .insert({ title: trimmed, user_id: userId })
    if (error) errorMessage.value = error.message
  }

  // Update：完了状態の切り替え
  async function toggleTodo(todo: Todo) {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !todo.is_completed })
      .eq('id', todo.id)
    if (error) errorMessage.value = error.message
  }

  // Delete：削除（画像があれば Storage からも削除）
  async function removeTodo(todo: Todo) {
    if (todo.image_path) {
      await supabase.storage.from(BUCKET).remove([todo.image_path])
    }
    const { error } = await supabase.from('todos').delete().eq('id', todo.id)
    if (error) errorMessage.value = error.message
    else await fetchTodos()
  }

  // 画像を 1 枚アップロードし、todos.image_path に保存
  async function attachImage(todo: Todo, file: File) {
    const ext = file.name.split('.').pop() ?? 'png'
    const path = `${userId}/${todo.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true })
    if (uploadError) {
      errorMessage.value = uploadError.message
      return
    }

    const { error: updateError } = await supabase
      .from('todos')
      .update({ image_path: path })
      .eq('id', todo.id)
    if (updateError) errorMessage.value = updateError.message
  }

  // 非公開バケットの画像を表示するための署名付き URL を取得
  async function getImageUrl(path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRES)
    if (error) return null
    return data.signedUrl
  }

  return {
    todos,
    loading,
    errorMessage,
    fetchTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    attachImage,
    getImageUrl,
  }
}
