# Day 2: Task Queue Manager 📋

## DSA Concept: Queue (FIFO - First In First Out)

### What is a Queue?
A queue is a linear data structure that follows the **First In, First Out (FIFO)** principle. Think of it like a line at a coffee shop - the first person in line gets served first.

**Core Operations:**
- `enqueue()` - Add element to the back (O(1))
- `dequeue()` - Remove element from the front (O(1))
- `front()` - View front element without removing (O(1))
- `isEmpty()` - Check if queue is empty (O(1))

### Real-World Application: Task Queue Manager

This project demonstrates how queues are used in job scheduling and task management systems:

1. **Task Queue**: Holds tasks waiting to be processed
2. **Processing Area**: Shows the current task being executed
3. **Completed Tasks**: Displays finished tasks with timing

#### How It Works:

**Adding a task (Enqueue):**
```
New task → Added to back of queue
Queue maintains FIFO order
```

**Processing tasks (Dequeue):**
```
Front task → Removed from queue
Task → Moves to processing area
After 2 seconds → Moves to completed
```

**Process All:**
```
Automatically processes each task in order
Maintains FIFO sequence
Visual feedback for each step
```

### Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (with animations & gradients)

### Features
✅ Visual queue representation  
✅ Real-time task processing simulation  
✅ Animated state transitions  
✅ Task statistics tracking  
✅ Multiple task types (Email, Report, Backup, Deploy, Test)  
✅ Process individually or batch process  
✅ Responsive design  

### How to Run
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies needed!

### Time Complexity
- Add task (enqueue): **O(1)**
- Process task (dequeue): **O(1)**
- View front task: **O(1)**

### Space Complexity
**O(n)** - where n is the total number of tasks in queue

### Interactive Features
- **Add Task**: Type a task name and select a type
- **Process Next**: Process the oldest task in queue
- **Process All**: Automatically process all tasks in order
- **Clear Queue**: Remove all pending tasks
- **Live Stats**: Track queue size, processing, and completed counts

### What I Learned
- Queue operations and FIFO principle
- How job schedulers work in operating systems
- Task management and processing visualization
- Async operations simulation
- State management with queues

### Real-World Applications
- **Print Spoolers**: Jobs are printed in the order they're received
- **CPU Task Scheduling**: Processes executed in order
- **Call Centers**: Calls answered in the order received
- **Breadth-First Search**: Graph traversal algorithm
- **Message Queues**: RabbitMQ, Kafka, AWS SQS

### Next Steps
Day 3 will explore another data structure - stay tuned! 🚀

---

**Part of #DSAInPublic series** | [View all projects](https://github.com/Tyagirohan/build-with-dsa)

