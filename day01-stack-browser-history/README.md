# Day 1: Browser History Navigator 🌐

## DSA Concept: Stack (LIFO - Last In First Out)

### What is a Stack?
A stack is a linear data structure that follows the **Last In, First Out (LIFO)** principle. Think of it like a stack of plates - you can only add or remove plates from the top.

**Core Operations:**
- `push()` - Add element to top (O(1))
- `pop()` - Remove element from top (O(1))
- `peek()` - View top element without removing (O(1))
- `isEmpty()` - Check if stack is empty (O(1))

### Real-World Application: Browser History

This project demonstrates how browsers use stacks to manage navigation history:

1. **Back Stack**: Stores previously visited pages
2. **Forward Stack**: Stores pages you can go forward to
3. **Current Page**: The page you're currently on

#### How It Works:

**Visiting a new page:**
```
Current page → pushed to back stack
New URL → becomes current page
Forward stack → cleared
```

**Going back:**
```
Current page → pushed to forward stack
Back stack top → popped and becomes current
```

**Going forward:**
```
Current page → pushed to back stack
Forward stack top → popped and becomes current
```

### Tech Stack
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 (with animations)

### Features
✅ Visual stack representation  
✅ Interactive browser simulation  
✅ Smooth animations  
✅ Responsive design  
✅ Real-time stack state visualization  

### How to Run
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies needed!

### Time Complexity
- Visit page: **O(1)**
- Go back: **O(1)**
- Go forward: **O(1)**
- Space: **O(n)** where n is number of pages visited

### Space Complexity
**O(n)** - where n is the total number of pages in both stacks

### What I Learned
- Stack operations and LIFO principle
- How browsers implement navigation
- State management with data structures
- Visual representation of abstract concepts

### Next Steps
Day 2 will explore **Queues** - stay tuned! 🚀

---

**Part of #DSAInPublic series** | [View all projects](https://github.com/Tyagirohan/build-with-dsa)

