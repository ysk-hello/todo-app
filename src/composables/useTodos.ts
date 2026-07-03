import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { Todo } from '../types/todo'

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

  // Delete：削除
  async function removeTodo(todo: Todo) {
    const { error } = await supabase.from('todos').delete().eq('id', todo.id)
    if (error) errorMessage.value = error.message
    else await fetchTodos()
  }

  return { todos, loading, errorMessage, fetchTodos, addTodo, toggleTodo, removeTodo }
}
