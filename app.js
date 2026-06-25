const API_URL = 'http://localhost:3000/api/todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dueDateInput = document.getElementById('todo-due-date');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const sortBySelect = document.getElementById('sort-by');
const sortOrderBtn = document.getElementById('sort-order-btn');

let currentOrder = 'desc';

function getApiUrl() {
  const sortBy = sortBySelect.value;
  const order = currentOrder;
  return `${API_URL}?sort_by=${sortBy}&order=${order}`;
}

async function fetchTodos() {
  const res = await fetch(getApiUrl());
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

async function createTodo(title, dueDate) {
  const body = { title };
  if (dueDate) {
    body.due_date = dueDate;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create todo');
  }

  return data;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  // dateStr could be "2026-07-01" or "2026-06-25 07:35:46"
  const date = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  return due < today;
}

function renderTodos(todos) {
  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
    return;
  }

  todoList.innerHTML = todos
    .map((todo) => {
      const overdue = !todo.completed && isOverdue(todo.due_date);
      const dueHtml = todo.due_date
        ? `<span class="todo-due">${escapeHtml(formatDate(todo.due_date))}</span>`
        : '';
      return `<li class="${overdue ? 'overdue' : ''}">
        <span class="todo-title">${escapeHtml(todo.title)}</span>
        ${dueHtml}
      </li>`;
    })
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

sortBySelect.addEventListener('change', () => {
  loadTodos();
});

sortOrderBtn.addEventListener('click', () => {
  currentOrder = currentOrder === 'desc' ? 'asc' : 'desc';
  sortOrderBtn.textContent = currentOrder === 'desc' ? '↓' : '↑';
  loadTodos();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const title = input.value.trim();
  if (!title) {
    showError('Title is required');
    return;
  }

  const dueDate = dueDateInput.value || null;

  const submitBtn = form.querySelector('button');
  submitBtn.disabled = true;

  try {
    await createTodo(title, dueDate);
    input.value = '';
    dueDateInput.value = '';
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
