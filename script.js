// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadTodos();
});

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon();
    }
}

function toggleTheme() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('.theme-icon');
    const isDarkMode = body.classList.contains('dark-mode');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
}

// Add todo when "Add" button is clicked
addBtn.addEventListener('click', addTodo);

// Add todo when Enter key is pressed
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();

    // Validate input
    if (todoText === '') {
        alert('Please enter a todo!');
        return;
    }

    // Create todo object
    const todo = {
        id: Date.now(),
        text: todoText,
        date: new Date().toLocaleString(),
        completed: false
    };

    // Save to localStorage
    saveTodoToStorage(todo);

    // Display todo
    displayTodo(todo);

    // Clear input field
    todoInput.value = '';
    todoInput.focus();
}

function displayTodo(todo) {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';
    if (todo.completed) {
        listItem.classList.add('completed');
    }
    listItem.setAttribute('data-id', todo.id);

    listItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id})">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;

    todoList.appendChild(listItem);
}

function deleteTodo(id) {
    // Remove from DOM
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    if (todoItem) {
        todoItem.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            todoItem.remove();
        }, 300);
    }

    // Remove from localStorage
    removeTodoFromStorage(id);
}

function saveTodoToStorage(todo) {
    const todos = getTodosFromStorage();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodoFromStorage(id) {
    const todos = getTodosFromStorage();
    const updatedTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

function getTodosFromStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function loadTodos() {
    const todos = getTodosFromStorage();
    todos.forEach(todo => displayTodo(todo));
}

function toggleComplete(id) {
    const todos = getTodosFromStorage();
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        
        // Update DOM
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.toggle('completed');
            const checkbox = todoItem.querySelector('.todo-checkbox');
            if (checkbox) {
                checkbox.checked = todo.completed;
            }
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
