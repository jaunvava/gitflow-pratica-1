// Gerenciar lista de tarefas no localStorage
class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
    this.setupEventListeners();
    this.renderTasks();
  }

  // Carregar tarefas do localStorage
  loadTasks() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  }

  // Salvar tarefas no localStorage
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // Configurar listeners dos botões
  setupEventListeners() {
    const inputElement = document.querySelector(".todo-input-group input");
    const addButton = document.querySelector(".btn-add");

    addButton.addEventListener("click", () => this.addTask(inputElement));
    inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask(inputElement);
      }
    });
  }

  // Adicionar nova tarefa
  addTask(inputElement) {
    const taskText = inputElement.value.trim();

    if (taskText === "") {
      alert("Por favor, digite uma tarefa válida");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    this.tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();
    inputElement.value = "";
    inputElement.focus();
  }

  // Renderizar todas as tarefas
  renderTasks() {
    const todoList = document.querySelector(".todo-list");
    todoList.innerHTML = "";

    if (this.tasks.length === 0) {
      todoList.innerHTML =
        '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhuma tarefa ainda. Adicione uma para começar! 🚀</p>';
      return;
    }

    this.tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      todoList.appendChild(taskElement);
    });
  }

  // Criar elemento da tarefa
  createTaskElement(task) {
    const div = document.createElement("div");
    div.className = `todo-item ${task.completed ? "completed" : ""}`;
    div.dataset.taskId = task.id;

    div.innerHTML = `
            <div class="todo-info">
                <div class="checkbox" data-id="${task.id}">
                    ${task.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ""}
                </div>
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
            </div>
            <div class="todo-actions">
                <button class="btn-icon btn-edit" data-id="${task.id}" title="Editar tarefa">✎</button>
                <button class="btn-icon btn-delete" data-id="${task.id}" title="Deletar tarefa">🗑</button>
            </div>
        `;

    // Listeners
    const checkbox = div.querySelector(".checkbox");
    checkbox.addEventListener("click", () => this.toggleTask(task.id));

    const deleteBtn = div.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", () => this.deleteTask(task.id));

    const editBtn = div.querySelector(".btn-edit");
    editBtn.addEventListener("click", () => this.editTask(task.id, task.text));

    return div;
  }

  // Alternar status de conclusão
  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  // Deletar tarefa
  deleteTask(id) {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.saveTasks();
      this.renderTasks();
    }
  }

  // Editar tarefa
  editTask(id, currentText) {
    const newText = prompt("Editar tarefa:", currentText);
    if (newText !== null && newText.trim() !== "") {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        task.text = newText.trim();
        this.saveTasks();
        this.renderTasks();
      }
    }
  }

  // Escapar HTML para evitar XSS
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new TaskManager();
});
