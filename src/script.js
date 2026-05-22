document.addEventListener('DOMContentLoaded', () => {
    const addInput = document.querySelector('#todo-add-input');
    const searchInput = document.querySelector('#todo-filter-input');
    const addButton = document.querySelector('#add-task-button');
    const validationMessage = document.querySelector('#validation-message');
    const filterButtons = document.querySelectorAll('[data-filter-status]');
    const todoList = document.querySelector('.todo-list');
    let currentStatus = 'all';

    function showValidation(message) {
        if (!validationMessage) return;
        validationMessage.textContent = message;
        validationMessage.classList.remove('hidden');
    }

    function clearValidation() {
        if (!validationMessage) return;
        validationMessage.textContent = '';
        validationMessage.classList.add('hidden');
    }

    function setAddLoading(isLoading) {
        if (!addButton) return;
        const spinner = addButton.querySelector('.btn-spinner');
        addButton.disabled = isLoading;
        addButton.classList.toggle('loading', isLoading);
        if (spinner) {
            spinner.classList.toggle('hidden', !isLoading);
        }
    }

    function createTodoItem(text) {
        const item = document.createElement('div');
        item.className = 'todo-item';
        item.innerHTML = `
            <div class="todo-info">
                <div class="checkbox"></div>
                <span class="todo-text"></span>
            </div>
            <div class="todo-actions">
                <button class="btn-icon">✎</button>
                <button class="btn-icon btn-delete">🗑</button>
            </div>
        `;

        item.querySelector('.todo-text').textContent = text;
        return item;
    }

    function updateVisibility() {
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const todoItems = Array.from(document.querySelectorAll('.todo-item'));

        todoItems.forEach(item => {
            const text = item.querySelector('.todo-text')?.textContent.toLowerCase() || '';
            const completed = item.classList.contains('completed');
            const matchesSearch = !searchValue || text.includes(searchValue);
            const matchesStatus =
                currentStatus === 'all' ||
                (currentStatus === 'completed' && completed) ||
                (currentStatus === 'pending' && !completed);

            item.style.display = matchesSearch && matchesStatus ? 'flex' : 'none';
        });
    }

    function addTask() {
        if (!addInput) return;
        const taskText = addInput.value.trim();

        if (!taskText) {
            showValidation('Digite uma tarefa antes de adicionar.');
            addInput.focus();
            return;
        }

        clearValidation();
        setAddLoading(true);

        window.setTimeout(() => {
            const newItem = createTodoItem(taskText);
            todoList?.appendChild(newItem);
            addInput.value = '';
            setAddLoading(false);
            updateVisibility();
        }, 500);
    }

    if (addButton) {
        addButton.addEventListener('click', addTask);
    }

    if (addInput) {
        addInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addTask();
            }
        });

        addInput.addEventListener('input', clearValidation);
    }

    if (searchInput) {
        searchInput.addEventListener('input', updateVisibility);
    }

    if (todoList) {
        todoList.addEventListener('click', event => {
            const clicked = event.target;
            const item = clicked.closest('.todo-item');
            if (!item) return;

            if (clicked.closest('.checkbox')) {
                item.classList.toggle('completed');
                updateVisibility();
            }

            if (clicked.closest('.btn-delete')) {
                item.remove();
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStatus = button.dataset.filterStatus;
            filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
            updateVisibility();
        });
    });

    updateVisibility();
});
