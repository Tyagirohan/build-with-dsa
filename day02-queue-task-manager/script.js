// Queue implementation
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }

    getAll() {
        return [...this.items];
    }
}

// Task Manager
class TaskManager {
    constructor() {
        this.taskQueue = new Queue();
        this.processingTask = null;
        this.completedTasks = [];
        this.taskId = 0;
    }

    addTask(name, type) {
        const task = {
            id: ++this.taskId,
            name,
            type,
            addedAt: new Date(),
            icon: this.getIconForType(type)
        };
        this.taskQueue.enqueue(task);
        return task;
    }

    processNext() {
        if (this.processingTask || this.taskQueue.isEmpty()) {
            return null;
        }

        this.processingTask = this.taskQueue.dequeue();
        return this.processingTask;
    }

    completeCurrentTask() {
        if (!this.processingTask) {
            return null;
        }

        const completedTask = {
            ...this.processingTask,
            completedAt: new Date()
        };
        
        this.completedTasks.unshift(completedTask);
        this.processingTask = null;
        
        return completedTask;
    }

    clearQueue() {
        this.taskQueue.clear();
    }

    getIconForType(type) {
        const icons = {
            email: '📧',
            report: '📊',
            backup: '💾',
            deploy: '🚀',
            test: '🧪'
        };
        return icons[type] || '📋';
    }

    getQueueSize() {
        return this.taskQueue.size();
    }

    isProcessing() {
        return this.processingTask !== null;
    }

    getCompletedCount() {
        return this.completedTasks.length;
    }
}

// UI Controller
const taskManager = new TaskManager();
let isProcessingAll = false;

const taskInput = document.getElementById('taskInput');
const taskType = document.getElementById('taskType');
const addTaskBtn = document.getElementById('addTaskBtn');
const processBtn = document.getElementById('processBtn');
const processAllBtn = document.getElementById('processAllBtn');
const clearBtn = document.getElementById('clearBtn');

const taskQueueEl = document.getElementById('taskQueue');
const processingAreaEl = document.getElementById('processingArea');
const completedListEl = document.getElementById('completedList');

const queueCount = document.getElementById('queueCount');
const processingCount = document.getElementById('processingCount');
const completedCount = document.getElementById('completedCount');

function updateUI() {
    // Update stats
    queueCount.textContent = taskManager.getQueueSize();
    processingCount.textContent = taskManager.isProcessing() ? '1' : '0';
    completedCount.textContent = taskManager.getCompletedCount();

    // Update button states
    const hasTasksInQueue = taskManager.getQueueSize() > 0;
    const isProcessing = taskManager.isProcessing();
    
    processBtn.disabled = !hasTasksInQueue || isProcessing;
    processAllBtn.disabled = !hasTasksInQueue || isProcessing;
    clearBtn.disabled = !hasTasksInQueue;

    // Render queue
    renderQueue();
    
    // Render processing area
    renderProcessingArea();
    
    // Render completed tasks
    renderCompletedTasks();
}

function renderQueue() {
    const tasks = taskManager.taskQueue.getAll();
    
    if (tasks.length === 0) {
        taskQueueEl.innerHTML = `
            <div class="empty-message">
                <p>Queue is empty</p>
                <small>Add tasks above to get started</small>
            </div>
        `;
        return;
    }

    taskQueueEl.innerHTML = tasks.map(task => `
        <div class="task-card">
            <span class="task-icon">${task.icon}</span>
            <div class="task-name">${task.name}</div>
            <div class="task-type">${task.type}</div>
            <div class="task-time">ID: #${task.id}</div>
        </div>
    `).join('');
}

function renderProcessingArea() {
    if (!taskManager.processingTask) {
        processingAreaEl.innerHTML = `
            <div class="empty-message">
                <p>No task processing</p>
                <small>Click "Process Next" to start</small>
            </div>
        `;
        return;
    }

    const task = taskManager.processingTask;
    processingAreaEl.innerHTML = `
        <div class="task-card processing">
            <span class="task-icon">${task.icon}</span>
            <div class="task-name">${task.name}</div>
            <div class="task-type">${task.type}</div>
            <div class="task-time">Processing... ⚡</div>
        </div>
    `;
}

function renderCompletedTasks() {
    if (taskManager.completedTasks.length === 0) {
        completedListEl.innerHTML = `
            <div class="empty-message">
                <p>No completed tasks yet</p>
            </div>
        `;
        return;
    }

    completedListEl.innerHTML = taskManager.completedTasks.map(task => {
        const duration = Math.floor((task.completedAt - task.addedAt) / 1000);
        return `
            <div class="completed-item">
                <div class="task-header">
                    <span class="task-icon">${task.icon}</span>
                    <div class="task-name">${task.name}</div>
                    <div class="task-time">${duration}s</div>
                </div>
            </div>
        `;
    }).join('');
}

function addTask() {
    const name = taskInput.value.trim();
    if (!name) {
        taskInput.focus();
        return;
    }

    const type = taskType.value;
    taskManager.addTask(name, type);
    
    taskInput.value = '';
    taskInput.focus();
    
    updateUI();
}

function processNextTask() {
    const task = taskManager.processNext();
    if (!task) return;

    updateUI();

    // Simulate processing time (2 seconds)
    setTimeout(() => {
        taskManager.completeCurrentTask();
        updateUI();

        // If processing all, continue with next task
        if (isProcessingAll && taskManager.getQueueSize() > 0) {
            processNextTask();
        } else {
            isProcessingAll = false;
        }
    }, 2000);
}

function processAllTasks() {
    if (taskManager.getQueueSize() === 0) return;
    
    isProcessingAll = true;
    processNextTask();
}

function clearQueue() {
    if (confirm('Are you sure you want to clear all tasks in the queue?')) {
        taskManager.clearQueue();
        updateUI();
    }
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

processBtn.addEventListener('click', processNextTask);
processAllBtn.addEventListener('click', processAllTasks);
clearBtn.addEventListener('click', clearQueue);

// Add some sample tasks on load
window.addEventListener('load', () => {
    taskManager.addTask('Send welcome email to new users', 'email');
    taskManager.addTask('Generate monthly sales report', 'report');
    taskManager.addTask('Backup customer database', 'backup');
    updateUI();
});

