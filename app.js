const API_URL = 'http://localhost:3000/api/todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');

async function fetchTodos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

async function createTodo(title) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create todo');
  }

  return data;
}

function renderTodos(todos) {
  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
    return;
  }

  todoList.innerHTML = todos
    .map((todo) => `<li>${escapeHtml(todo.title)}</li>`)
    .join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const title = input.value.trim();
  if (!title) {
    showError('Title is required');
    return;
  }

  const submitBtn = form.querySelector('button');
  submitBtn.disabled = true;

  try {
    await createTodo(title);
    input.value = '';
    await loadTodos();
  } catch (err) {
    showError(err.message);
  } finally {
    submitBtn.disabled = false;
  }
});

async function loadTodos() {
  try {
    const todos = await fetchTodos();
    renderTodos(todos);
    hideError();
  } catch (err) {
    showError(err.message);
  }
}

loadTodos();
