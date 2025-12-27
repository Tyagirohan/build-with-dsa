# Day 5: Family Tree Explorer 👨‍👩‍👧‍👦

## DSA Concept: Trees (N-ary Tree)

### What is a Tree?
A tree is a hierarchical data structure consisting of nodes connected by edges. Each node can have zero or more children, and there is exactly one path between any two nodes.

**Tree Terminology:**
- **Root**: The topmost node (ancestor)
- **Parent**: A node that has children
- **Child**: A node connected to a parent above it
- **Siblings**: Nodes that share the same parent
- **Leaf**: A node with no children
- **Height**: Length of longest path from root to leaf
- **Depth**: Distance from root to a node

**Core Operations:**
- `addNode(parent, child)` - Add child to parent (O(1))
- `removeNode(node)` - Remove node and descendants (O(n))
- `search(value)` - Find node by value (O(n))
- `traverse()` - Visit all nodes (O(n))

### Real-World Application: Family Tree

This project demonstrates how tree structures represent hierarchical relationships:

1. **Parent-Child Relationships**: Natural tree structure
2. **Spouse Relationships**: Lateral connections between nodes
3. **Generational Hierarchy**: Tree levels represent generations
4. **Descendant Tracking**: Recursive traversal of children

#### How It Works:

**Tree Structure:**
```
              Root (Grandparent)
                     |
         +-----------+-----------+
         |                       |
      Parent 1 ←─💕─→ Spouse   Parent 2
         |
    +----+----+
    |         |
  Child1   Child2
```

**Adding a Child:**
```javascript
parent.addChild(child)
child.parent = parent
// O(1) operation
```

**Removing a Node:**
```javascript
removeNode(node) {
  // Remove from parent
  parent.removeChild(node)
  // Remove all descendants recursively
  node.children.forEach(child => removeNode(child))
}
// O(n) where n = descendants
```

**Finding Relationship:**
```javascript
// Check parent-child
if (node1.parent === node2) return "Child of"
// Check siblings
if (node1.parent === node2.parent) return "Sibling"
// Check grandparent
if (node1.parent?.parent === node2) return "Grandchild of"
```

### Tech Stack
- Vanilla JavaScript (ES6+ Classes)
- HTML5
- CSS3 (Gradient theme with animations)

### Features
✅ **Add family members** - Root, parent, child, spouse  
✅ **Visual tree structure** - Hierarchical layout with connections  
✅ **Person cards** - Avatar, name, age, birth year  
✅ **Quick actions** - Add spouse/child directly from cards  
✅ **Search by name** - Highlights matching members  
✅ **Find relationships** - Calculates relationship between any 2 people  
✅ **Tree statistics** - Total members, generations, height  
✅ **Zoom controls** - In/out/reset for large trees  
✅ **Marriage lines** - Visual spouse connections with 💕  
✅ **Delete members** - Removes person and all descendants  

### How to Run
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies needed!

### Time Complexity
| Operation | Time Complexity |
|-----------|----------------|
| Add child | O(1) |
| Add spouse | O(1) |
| Remove node | O(n) - removes all descendants |
| Search by name | O(n) |
| Find relationship | O(h) - h = height |
| Calculate height | O(n) |
| Traverse tree | O(n) |

### Space Complexity
**O(n)** - where n is the number of family members

### Interactive Features
- **Add Root**: Start your family tree
- **Add Family**: Parent, child, or spouse relationships
- **Quick Add**: Click buttons on person cards
- **Search**: Find members by name
- **Relationship Finder**: See how any 2 people are related
- **Zoom**: Navigate large family trees
- **Delete**: Remove members (with confirmation)

### What I Learned
- Tree data structure implementation
- Parent-child pointer management
- Recursive tree traversal (DFS)
- N-ary tree (multiple children per node)
- Sibling and spouse relationships
- Height and depth calculations
- Hierarchical data visualization

### Real-World Applications
- **Genealogy**: Family trees, ancestry tracking
- **Organization Charts**: Company hierarchies
- **File Systems**: Folders and files structure
- **DOM**: HTML document structure
- **Decision Trees**: ML algorithms, game AI
- **Category Hierarchies**: Product categories, taxonomies

### Tree Types Comparison

**Binary Tree:**
- Each node has max 2 children
- Used in: BST, heaps, expression trees

**N-ary Tree (This Project):**
- Each node can have any number of children
- Used in: File systems, org charts, family trees

**Trie:**
- Tree for storing strings
- Used in: Autocomplete, spell checking

### Advantages of Trees
1. **Hierarchical representation** - Natural for parent-child relationships
2. **Efficient searching** - O(log n) in balanced trees
3. **Easy insertion/deletion** - At specific positions
4. **Flexible structure** - Can grow/shrink dynamically

### Relationship Detection Algorithm
```javascript
// Direct relationships: O(1)
- Parent/Child: Check node.parent or node.children
- Spouse: Check node.spouse
- Siblings: Check node.parent.children

// Extended relationships: O(h) where h = height
- Grandparent: node.parent?.parent
- Aunt/Uncle: node.parent?.parent?.children
- Cousin: Complex traversal
```

### Visualization Features
- **Person Cards**: Gradient borders, avatars, hover effects
- **Marriage Lines**: Connect spouses with 💕 symbol
- **Generational Levels**: Clear parent-child hierarchy
- **Responsive Layout**: Adapts to tree size
- **Smooth Animations**: Fade in, hover elevation
- **Gender Icons**: 👨👩🧑 based on gender

### Next Steps
Day 6 will explore the final data structure - stay tuned! 🚀

---

**Part of #DSAInPublic series** | [View all projects](https://github.com/Tyagirohan/build-with-dsa)

