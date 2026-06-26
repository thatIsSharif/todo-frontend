const API_URL = 'http://localhost:3000/api/todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle-input');

// Dark mode toggle
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.checked = theme === 'dark';
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked ? 'dark' : 'light');
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

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

async function updateTodoCompletion(id, completed) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update todo');
  }

  return data;
}

function renderTodos(todos) {
  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
    return;
  }

  todoList.innerHTML = todos
    .map(
      (todo) => `
    <li class="${todo.completed ? 'completed' : ''}">
      <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
      <span class="todo-title">${escapeHtml(todo.title)}</span>
    </li>`
    )
    .join('');

  document.querySelectorAll('.todo-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', async (e) => {
      const id = Number(e.target.dataset.id);
      const completed = e.target.checked;
      const li = e.target.closest('li');

      try {
        await updateTodoCompletion(id, completed);
        li.classList.toggle('completed', completed);
      } catch (err) {
        showError(err.message);
        e.target.checked = !completed;
      }
    });
  });
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
