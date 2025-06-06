document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const counter = document.getElementById('counter');
    const clearBtn = document.getElementById('clearBtn');
    const themeToggle = document.querySelector('.theme-toggle');
    let emptyState = document.querySelector('.empty-state');

    // Alternar modo claro/escuro
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        saveThemePreference();
    });

    // Carregar preferências
    loadThemePreference();
    loadTasks();

    // Adicionar tarefa
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        
        if(taskText !== '') {
            // Remover estado vazio se existir
            if(emptyState) {
                emptyState.remove();
                emptyState = null;
            }
            
            // Criar elemento HTML da tarefa
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span class="task-text">${taskText}</span>
                <div class="task-actions">
                    <button class="delete-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
            taskInput.value = '';
            taskInput.focus();
            
            // Adicionar eventos
            const deleteBtn = taskItem.querySelector('.delete-btn');
            const checkbox = taskItem.querySelector('.task-checkbox');
            
            deleteBtn.addEventListener('click', () => {
                taskItem.classList.add('fade-out');
                setTimeout(() => {
                    taskItem.remove();
                    updateCounter();
                    saveTasks();
                    checkEmptyState();
                }, 300);
            });
            
            checkbox.addEventListener('change', () => {
                taskItem.classList.toggle('completed', checkbox.checked);
                updateCounter();
                saveTasks();
            });
            
            updateCounter();
            saveTasks();
        }
    }

    // Atualizar contador
    function updateCounter() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        counter.textContent = `${totalTasks - completedTasks} tarefa(s) restante(s)`;
    }

    // Limpar tarefas concluídas
    clearBtn.addEventListener('click', () => {
        const completedTasks = document.querySelectorAll('.task-item.completed');
        
        if(completedTasks.length > 0) {
            completedTasks.forEach(task => {
                task.classList.add('fade-out');
                setTimeout(() => {
                    task.remove();
                    updateCounter();
                    saveTasks();
                    checkEmptyState();
                }, 300);
            });
        }
    });

    // Verificar estado vazio
    function checkEmptyState() {
        if(taskList.querySelectorAll('.task-item').length === 0) {
            const emptyHtml = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Lista vazia</h3>
                    <p>Adicione tarefas para começar a organizar seu dia!</p>
                </div>
            `;
            taskList.innerHTML = emptyHtml;
            emptyState = taskList.querySelector('.empty-state');
        }
    }

    // Salvar tarefas no localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                completed: task.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Carregar tarefas do localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        if(tasks.length > 0) {
            if(emptyState) {
                emptyState.remove();
                emptyState = null;
            }
            
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item${task.completed ? ' completed' : ''}`;
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="delete-btn">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
                
                const deleteBtn = taskItem.querySelector('.delete-btn');
                const checkbox = taskItem.querySelector('.task-checkbox');
                
                deleteBtn.addEventListener('click', () => {
                    taskItem.classList.add('fade-out');
                    setTimeout(() => {
                        taskItem.remove();
                        updateCounter();
                        saveTasks();
                        checkEmptyState();
                    }, 300);
                });
                
                checkbox.addEventListener('change', () => {
                    taskItem.classList.toggle('completed', checkbox.checked);
                    updateCounter();
                    saveTasks();
                });
            });
        }
        updateCounter();
    }

    // Salvar preferência de tema
    function saveThemePreference() {
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // Carregar preferência de tema
    function loadThemePreference() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if(darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
});