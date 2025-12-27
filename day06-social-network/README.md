# Day 6: Social Network Visualizer 👥

## DSA Concept: Graphs (Undirected Graph with Adjacency List)

### What is a Graph?
A graph is a data structure consisting of nodes (vertices) connected by edges. Graphs can represent relationships, networks, paths, and connections between entities.

**Graph Terminology:**
- **Vertex/Node**: A point in the graph (person in social network)
- **Edge**: Connection between two vertices (friendship)
- **Degree**: Number of edges connected to a vertex
- **Path**: Sequence of vertices connected by edges
- **Connected**: Two vertices are connected if a path exists between them
- **Undirected Graph**: Edges have no direction (mutual friendship)
- **Adjacency List**: Map of vertex → list of neighbors

**Core Operations:**
- `addVertex(v)` - Add new vertex (O(1))
- `addEdge(v1, v2)` - Connect two vertices (O(1))
- `removeVertex(v)` - Remove vertex and its edges (O(V+E))
- `BFS(start, end)` - Breadth-first search (O(V+E))
- `DFS(start)` - Depth-first search (O(V+E))

### Real-World Application: Social Network

This project demonstrates how graphs power social networks like Facebook, LinkedIn, Instagram:

1. **People as Nodes**: Each person is a vertex in the graph
2. **Friendships as Edges**: Connections between people
3. **Friend Suggestions**: Find friends of friends (2-hop neighbors)
4. **Mutual Friends**: Set intersection of friend lists
5. **Degrees of Separation**: Shortest path using BFS

#### How It Works:

**Graph Structure (Adjacency List):**
```javascript
{
  Alice: [Bob, Carol, Dave],
  Bob: [Alice, Dave],
  Carol: [Alice, Dave],
  Dave: [Alice, Bob, Carol, Eve],
  Eve: [Dave]
}
```

**Adding Connection:**
```javascript
addEdge(person1, person2) {
  adjacencyList[person1].add(person2)
  adjacencyList[person2].add(person1)
  // O(1) - undirected graph
}
```

**Finding Shortest Path (BFS):**
```javascript
BFS(start, end) {
  queue = [[start]]
  visited = {start}
  
  while queue not empty:
    path = queue.dequeue()
    current = path.last()
    
    if current == end:
      return path
      
    for neighbor in adjacencyList[current]:
      if neighbor not visited:
        queue.enqueue([...path, neighbor])
        visited.add(neighbor)
}
// O(V + E)
```

**Friend Suggestions (Friends of Friends):**
```javascript
suggestFriends(person) {
  suggestions = {}
  
  for friend in person.friends:
    for friendOfFriend in friend.friends:
      if friendOfFriend != person and not already friends:
        suggestions[friendOfFriend]++
  
  return suggestions sorted by count
}
// O(V * E) worst case
```

### Tech Stack
- Vanilla JavaScript (ES6+ with Map and Set)
- HTML5 Canvas for graph visualization
- CSS3 (Gradient theme with animations)

### Features
✅ **Add people** - Build your network  
✅ **Create connections** - Link friends together  
✅ **Interactive graph** - Drag nodes to rearrange  
✅ **Find mutual friends** - See shared connections  
✅ **Friend suggestions** - Discover friends of friends  
✅ **Degrees of separation** - Calculate shortest path  
✅ **Network statistics** - Total people, connections, average friends  
✅ **Visual canvas** - Real-time graph rendering  
✅ **Toggle labels** - Show/hide names  
✅ **Reset layout** - Rearrange nodes in circle  

### How to Run
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies needed!

### Time Complexity
| Operation | Time Complexity |
|-----------|----------------|
| Add person | O(1) |
| Add connection | O(1) |
| Remove person | O(V + E) |
| Find shortest path (BFS) | O(V + E) |
| Mutual friends | O(E) |
| Friend suggestions | O(V * E) worst case |
| Draw graph | O(V + E) |

Where V = number of vertices (people), E = number of edges (connections)

### Space Complexity
**O(V + E)** - Adjacency list stores all vertices and edges

### Interactive Features
- **Add Person**: Enter name and bio
- **Connect Friends**: Select 2 people to connect
- **Drag Nodes**: Click and drag to reposition people
- **Find Mutual Friends**: See who 2 people both know
- **Friend Suggestions**: Get recommendations (friends of friends)
- **Degrees of Separation**: Calculate connection distance
- **Network Stats**: View total people, connections, averages
- **Toggle Labels**: Show/hide names on graph
- **Reset Layout**: Rearrange nodes in circular pattern

### What I Learned
- Graph data structure (adjacency list representation)
- BFS (Breadth-First Search) algorithm
- Shortest path finding
- Undirected graph operations
- Set operations for mutual friends
- Canvas API for visualization
- Interactive graph manipulation

### Real-World Applications
- **Social Networks**: Facebook, LinkedIn, Instagram, Twitter
- **Recommendation Systems**: "People You May Know"
- **Network Analysis**: Community detection, influencers
- **Routing**: GPS navigation, network routing
- **Web Crawling**: Page rank, search engines
- **Dependency Resolution**: Package managers
- **Game Development**: Pathfinding, AI

### Graph Types Comparison

**Undirected Graph (This Project):**
- Edges have no direction
- A→B means B→A
- Used in: Social networks (friendship is mutual)

**Directed Graph:**
- Edges have direction
- A→B doesn't mean B→A
- Used in: Twitter (follow is one-way), web pages

**Weighted Graph:**
- Edges have weights/costs
- Used in: Maps (distances), networks (latency)

### Algorithms Implemented

**1. BFS (Breadth-First Search):**
- Explores neighbors level by level
- Finds shortest path
- Time: O(V + E)
- Used in: Degrees of separation

**2. Set Intersection:**
- Find common elements
- Time: O(E)
- Used in: Mutual friends

**3. Graph Traversal:**
- Visit all reachable nodes
- Time: O(V + E)
- Used in: Friend suggestions

### Advantages of Graphs
1. **Model relationships** - Natural for connected data
2. **Efficient queries** - Fast neighbor lookup with adjacency list
3. **Flexible structure** - Can represent complex networks
4. **Rich algorithms** - BFS, DFS, shortest path, etc.

### Graph Visualization
- **Canvas API**: HTML5 canvas for drawing
- **Node Positions**: Stored in Map for drag & drop
- **Circle Layout**: Nodes arranged in circle by default
- **Edge Drawing**: Lines connect friends
- **Interactive**: Drag nodes to rearrange
- **Labels**: Toggle names on/off

### Performance Optimizations
- **Adjacency List**: O(1) edge lookup
- **Set for neighbors**: Fast contains check
- **Map for positions**: Quick node access
- **Canvas rendering**: Hardware accelerated

### Series Finale
This is Day 6 - the final project in the #DSAInPublic series! 🎉

**Complete Series:**
1. Day 1: Browser History (Stacks)
2. Day 2: Task Queue Manager (Queues)
3. Day 3: URL Shortener (Hash Maps)
4. Day 4: Music Playlist (Linked Lists)
5. Day 5: Family Tree (Trees)
6. Day 6: Social Network (Graphs) ← You are here!

---

**Part of #DSAInPublic series** | [View all projects](https://github.com/Tyagirohan/build-with-dsa)

