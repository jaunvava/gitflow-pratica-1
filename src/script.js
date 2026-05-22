document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#todo-filter-input');
    const filterButtons = document.querySelectorAll('[data-filter-status]');
    const todoItems = Array.from(document.querySelectorAll('.todo-item'));
    let currentStatus = 'all';

    function updateVisibility() {
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

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

    if (searchInput) {
        searchInput.addEventListener('input', updateVisibility);
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
