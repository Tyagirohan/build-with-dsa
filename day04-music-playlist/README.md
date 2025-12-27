# Day 4: Music Playlist Manager 🎵

## DSA Concept: Doubly Linked List

### What is a Doubly Linked List?
A doubly linked list is a linear data structure where each node contains data and two pointers - one pointing to the next node and one to the previous node. This allows traversal in both directions.

**Node Structure:**
```javascript
{
  prev: pointer to previous node,
  data: the actual data,
  next: pointer to next node
}
```

**Core Operations:**
- `append(data)` - Add node at end (O(1) with tail pointer)
- `prepend(data)` - Add node at beginning (O(1))
- `insertAfter(node, data)` - Insert after specific node (O(1))
- `remove(node)` - Remove specific node (O(1) when node is known)
- `traverse()` - Visit all nodes (O(n))

### Real-World Application: Music Playlist

This project demonstrates how doubly linked lists power music players and playlist management:

1. **Sequential Playback**: Navigate forward/backward through songs
2. **Dynamic Playlist**: Add/remove songs without reallocation
3. **Current Song Tracking**: Maintain pointer to currently playing song
4. **Bi-directional Navigation**: Move to next or previous song in O(1)

#### How It Works:

**Playlist Structure:**
```
HEAD → [Song1] ⇄ [Song2] ⇄ [Song3] ⇄ [Song4] ← TAIL
        prev/next  prev/next  prev/next  prev/next
```

**Adding a song at end (append):**
```javascript
newNode.prev = tail
tail.next = newNode
tail = newNode
// O(1) operation
```

**Removing current song:**
```javascript
currentNode.prev.next = currentNode.next
currentNode.next.prev = currentNode.prev
// O(1) operation - no shifting needed!
```

**Next/Previous:**
```javascript
next: current = current.next     // O(1)
prev: current = current.prev     // O(1)
```

### Tech Stack
- Vanilla JavaScript (ES6+ Classes)
- HTML5
- CSS3 (Spotify-inspired green theme)

### Features
✅ **Add songs** - Append, prepend, or insert after current  
✅ **Player controls** - Play/pause, next, previous  
✅ **Doubly linked list visualization** - See prev/next pointers  
✅ **Click any song** - Jump to specific song in playlist  
✅ **Remove songs** - Delete current song dynamically  
✅ **Shuffle playlist** - Randomize song order  
✅ **Clear all** - Reset entire playlist  
✅ **Live stats** - Track total songs and position  
✅ **Now playing display** - Visual feedback for current song  

### How to Run
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies needed!

### Time Complexity
| Operation | Time Complexity |
|-----------|----------------|
| Append | O(1) |
| Prepend | O(1) |
| Insert After (node known) | O(1) |
| Remove (node known) | O(1) |
| Next/Previous | O(1) |
| Access by index | O(n) |
| Search | O(n) |

### Space Complexity
**O(n)** - where n is the number of songs (plus extra space for prev pointers)

### Interactive Features
- **Add Song**: Enter song name and artist, choose position
- **Play/Pause**: Toggle playback state
- **Next/Previous**: Navigate through playlist
- **Remove Current**: Delete currently playing song
- **Shuffle**: Randomize playlist order
- **Click Song**: Jump to any song instantly
- **Visual Pointers**: See prev/next connections in linked list

### What I Learned
- Doubly linked list implementation from scratch
- How music players manage playlists
- O(1) insertion and deletion operations
- Bi-directional traversal with prev/next pointers
- Dynamic memory allocation advantages
- Difference between singly and doubly linked lists

### Real-World Applications
- **Music Players**: Spotify, Apple Music, YouTube Music
- **Browser History**: Forward/back navigation
- **Undo/Redo Systems**: Text editors, Photoshop
- **Image Viewers**: Navigate through photos
- **LRU Cache**: Least Recently Used cache implementation
- **Navigation Systems**: GPS route planning

### Doubly vs Singly Linked Lists

**Doubly Linked List:**
- ✅ Bi-directional traversal
- ✅ O(1) deletion (no need to find previous node)
- ❌ Extra memory for prev pointers
- ❌ More complex implementation

**Singly Linked List:**
- ✅ Less memory (only next pointer)
- ✅ Simpler implementation
- ❌ One-direction traversal only
- ❌ O(n) to find previous node

**When to use which?**
- Use **doubly** when you need bi-directional navigation (playlists, undo/redo)
- Use **singly** when memory is constrained and you only go forward

### Advantages Over Arrays
1. **Dynamic size** - No need to pre-allocate memory
2. **O(1) insert/delete** - No shifting elements
3. **No wasted space** - Grows/shrinks as needed

### Disadvantages vs Arrays
1. **O(n) access** - Must traverse from head
2. **Extra memory** - Pointers take space
3. **No cache locality** - Nodes scattered in memory

### Next Steps
Day 5 will explore another data structure - stay tuned! 🚀

---

**Part of #DSAInPublic series** | [View all projects](https://github.com/Tyagirohan/build-with-dsa)

