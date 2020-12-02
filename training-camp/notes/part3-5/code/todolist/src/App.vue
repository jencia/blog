<template>
  <div>
    <div>
      <input v-model="input" @keyup.enter="addTodo">
      &nbsp;<button @click="addTodo">添加</button>
    </div>
    <ul>
      <li v-for="(todo, i) in filteredTodos" :key="todo">
        <template v-if="!todo.isEdit">
          <label>
            <input type="checkbox" v-model="todo.completed" />
            <span>{{ todo.text }}</span>
          </label>
          &nbsp;<button @click="editTodo(i)">编辑</button>
          &nbsp;<button @click="removeTodo(i)">删除</button>
        </template>
        <template v-else>
          <input v-model="editInput" />&nbsp;
          &nbsp;<button @click="doneEdit(i)">完成</button>
          &nbsp;<button @click="cancelEdit(i)">取消</button>
        </template>
      </li>
    </ul>
    <p v-if="todos.length > 0">
      <label>
        <input type="checkbox" v-model="allChecked"> 全选
      </label>
      &nbsp;
      <a href="#/all">所有</a>
      &nbsp;
      <a href="#/active">未完成</a>
      &nbsp;
      <a href="#/completed">已完成</a>
      &nbsp;
      <button @click="removeCompletedTodo">清除已完成</button>
    </p>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'

const filterFn = {
  all: todos => todos.value,
  active: todos => todos.value.filter(v => !v.completed),
  completed: todos => todos.value.filter(v => v.completed),
}

function useAdd (list) {
  const input = ref('')
  const addTodo = () => {
    const text = input.value && input.value.trim()

    if (text.length > 0) {
      list.value.unshift({
        text,
        completed: false
      })
      input.value = ''
    }
  }

  return {
    input,
    addTodo 
  }
}

function useRemove (todos) {
  const removeTodo = i => todos.value.splice(i, 1)
  const removeCompletedTodo = i => (todos.value = filterFn.active(todos))

  return {
    removeTodo,
    removeCompletedTodo
  }
}

function useEdit (todos, removeTodo) {
  let oldValue = ''
  const editInput = ref('')
  
  const editTodo = i => {
    const text = todos.value[i].text

    oldValue = text
    editInput.value = text
    todos.value[i].isEdit = true
  }
  const doneEdit = i => {
    const text = editInput.value && editInput.value.trim()

    todos.value[i].text = text
    text || removeTodo(i)
    
    oldValue = ''
    editInput.value = ''
    todos.value[i].isEdit = false
  }
  const cancelEdit = i => {
    todos.value[i].text = oldValue
    oldValue = ''
    editInput.value = ''
    todos.value[i].isEdit = false
  }

  return { editInput, editTodo, doneEdit, cancelEdit }
}

function useFilter (todos) {
  const type = ref('all')
  const allChecked = computed({
    get () {
      return todos.value.every(v => v.completed)
    },
    set (value) {
      todos.value = todos.value.map(v => ({ ...v, completed: value }))
    }
  })
  const filteredTodos = computed(() => (filterFn[type.value](todos)))

  const hashChange = () => {
    const hash = window.location.hash.replace('#/', '')

    if (filterFn[hash]) {
      type.value = hash
    } else {
      type.value = 'all'
      window.location.hash = ''
    }
  }

  onMounted(() => {
    window.addEventListener('hashchange', hashChange)
    hashChange()
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', hashChange)
  })

  return { allChecked, filteredTodos }
}

const storge = {
  get (key) {
    let data

    try {
      data = JSON.parse(localStorage.getItem(key))
    } catch (e) {
      data = null
    }
    return data
  },
  set (key, value) {
    let data

    try {
      data = JSON.stringify(value)
    } catch (e) {
      data = value
    }
    localStorage.setItem(key, data)
  }
}

function useStorge () {
  const KEY = 'TODO_DATA'
  const todos = ref(storge.get(KEY) || [])

  watchEffect(() => {
    storge.set(KEY, todos.value)
  })
  return todos
}

export default {
  name: 'App',
  setup () {
    const todos = useStorge([])
    const { removeTodo, removeCompletedTodo } = useRemove(todos)

    return {
      todos,
      removeTodo,
      removeCompletedTodo,
      ...useAdd(todos),
      ...useEdit(todos, removeTodo),
      ...useFilter(todos),
    }
  }
}
</script>
