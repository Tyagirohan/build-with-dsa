// Graph class for Social Network
class SocialNetwork {
    constructor() {
        this.adjacencyList = new Map(); // person id -> Set of friend ids
        this.people = new Map(); // person id -> person data
        this.nextId = 1;
    }

    addPerson(name, bio) {
        const person = {
            id: this.nextId++,
            name,
            bio,
            friends: []
        };
        
        this.people.set(person.id, person);
        this.adjacencyList.set(person.id, new Set());
        
        return person;
    }

    addConnection(id1, id2) {
        if (!this.people.has(id1) || !this.people.has(id2)) {
            throw new Error('Person not found');
        }
        
        if (id1 === id2) {
            throw new Error('Cannot connect person to themselves');
        }
        
        // Check if already connected
        if (this.adjacencyList.get(id1).has(id2)) {
            throw new Error('Already friends');
        }
        
        // Undirected graph - add both directions
        this.adjacencyList.get(id1).add(id2);
        this.adjacencyList.get(id2).add(id1);
        
        // Update friends arrays
        const person1 = this.people.get(id1);
        const person2 = this.people.get(id2);
        person1.friends.push(id2);
        person2.friends.push(id1);
    }

    removePerson(id) {
        if (!this.people.has(id)) return false;
        
        // Remove all connections to this person
        const friends = this.adjacencyList.get(id);
        friends.forEach(friendId => {
            this.adjacencyList.get(friendId).delete(id);
            const friend = this.people.get(friendId);
            friend.friends = friend.friends.filter(fid => fid !== id);
        });
        
        // Remove person
        this.adjacencyList.delete(id);
        this.people.delete(id);
        
        return true;
    }

    // BFS to find shortest path
    findShortestPath(startId, endId) {
        if (!this.people.has(startId) || !this.people.has(endId)) {
            return null;
        }
        
        if (startId === endId) return [startId];
        
        const queue = [[startId]];
        const visited = new Set([startId]);
        
        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            
            const neighbors = this.adjacencyList.get(current);
            
            for (const neighbor of neighbors) {
                if (neighbor === endId) {
                    return [...path, neighbor];
                }
                
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([...path, neighbor]);
                }
            }
        }
        
        return null; // No path found
    }

    // Find mutual friends
    findMutualFriends(id1, id2) {
        if (!this.people.has(id1) || !this.people.has(id2)) {
            return [];
        }
        
        const friends1 = this.adjacencyList.get(id1);
        const friends2 = this.adjacencyList.get(id2);
        
        const mutual = [];
        friends1.forEach(friendId => {
            if (friends2.has(friendId)) {
                mutual.push(friendId);
            }
        });
        
        return mutual;
    }

    // Suggest friends (friends of friends)
    suggestFriends(personId) {
        if (!this.people.has(personId)) return [];
        
        const currentFriends = this.adjacencyList.get(personId);
        const suggestions = new Map(); // id -> count of mutual friends
        
        // Check friends of friends
        currentFriends.forEach(friendId => {
            const friendsOfFriend = this.adjacencyList.get(friendId);
            friendsOfFriend.forEach(fofId => {
                // Don't suggest current friends or self
                if (fofId !== personId && !currentFriends.has(fofId)) {
                    suggestions.set(fofId, (suggestions.get(fofId) || 0) + 1);
                }
            });
        });
        
        // Sort by number of mutual friends
        return Array.from(suggestions.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([id, count]) => ({ id, mutualCount: count }));
    }

    // Get degrees of separation
    getDegreesOfSeparation(id1, id2) {
        const path = this.findShortestPath(id1, id2);
        return path ? path.length - 1 : -1;
    }

    getTotalConnections() {
        let total = 0;
        this.adjacencyList.forEach(friends => {
            total += friends.size;
        });
        return total / 2; // Divide by 2 because undirected
    }

    getAverageFriends() {
        if (this.people.size === 0) return 0;
        return (this.getTotalConnections() * 2 / this.people.size).toFixed(1);
    }

    clear() {
        this.adjacencyList.clear();
        this.people.clear();
        this.nextId = 1;
    }

    getAllPeople() {
        return Array.from(this.people.values());
    }

    getPerson(id) {
        return this.people.get(id);
    }
}

// UI Controller
const socialNetwork = new SocialNetwork();
let canvas, ctx;
let nodePositions = new Map();
let showLabels = true;
let isDragging = false;
let draggedNode = null;

// DOM Elements
const personNameInput = document.getElementById('personName');
const personBioInput = document.getElementById('personBio');
const addPersonBtn = document.getElementById('addPersonBtn');

const person1Select = document.getElementById('person1Select');
const person2Select = document.getElementById('person2Select');
const connectBtn = document.getElementById('connectBtn');

const mutualPerson1 = document.getElementById('mutualPerson1');
const mutualPerson2 = document.getElementById('mutualPerson2');
const findMutualBtn = document.getElementById('findMutualBtn');
const mutualResult = document.getElementById('mutualResult');

const suggestForPerson = document.getElementById('suggestForPerson');
const suggestBtn = document.getElementById('suggestBtn');
const suggestResult = document.getElementById('suggestResult');

const degreePerson1 = document.getElementById('degreePerson1');
const degreePerson2 = document.getElementById('degreePerson2');
const degreeBtn = document.getElementById('degreeBtn');
const degreeResult = document.getElementById('degreeResult');

const totalPeopleEl = document.getElementById('totalPeople');
const totalConnectionsEl = document.getElementById('totalConnections');
const avgFriendsEl = document.getElementById('avgFriends');

const clearNetworkBtn = document.getElementById('clearNetworkBtn');
const resetLayoutBtn = document.getElementById('resetLayoutBtn');
const toggleLabelsBtn = document.getElementById('toggleLabelsBtn');

const peopleListEl = document.getElementById('peopleList');
const graphOverlay = document.getElementById('graphOverlay');
const toast = document.getElementById('toast');

// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('networkCanvas');
    ctx = canvas.getContext('2d');
    
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Mouse events for dragging
    canvas.addEventListener('mousedown', onCanvasMouseDown);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseup', onCanvasMouseUp);
    canvas.addEventListener('mouseleave', onCanvasMouseUp);
}

// Add person
function addPerson() {
    const name = personNameInput.value.trim();
    const bio = personBioInput.value.trim();
    
    if (!name) {
        showToast('Please enter a name', 'error');
        return;
    }
    
    const person = socialNetwork.addPerson(name, bio || 'No bio');
    
    // Random position for new node
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = Math.random() * (canvas.height - 100) + 50;
    nodePositions.set(person.id, { x, y });
    
    personNameInput.value = '';
    personBioInput.value = '';
    personNameInput.focus();
    
    updateUI();
    showToast(`👤 Added ${name} to network`);
}

addPersonBtn.addEventListener('click', addPerson);

personNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPerson();
});

// Create connection
connectBtn.addEventListener('click', () => {
    const id1 = parseInt(person1Select.value);
    const id2 = parseInt(person2Select.value);
    
    if (!id1 || !id2) {
        showToast('Please select both people', 'error');
        return;
    }
    
    try {
        socialNetwork.addConnection(id1, id2);
        const p1 = socialNetwork.getPerson(id1);
        const p2 = socialNetwork.getPerson(id2);
        updateUI();
        showToast(`🤝 ${p1.name} and ${p2.name} are now friends!`);
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Find mutual friends
findMutualBtn.addEventListener('click', () => {
    const id1 = parseInt(mutualPerson1.value);
    const id2 = parseInt(mutualPerson2.value);
    
    if (!id1 || !id2) {
        showToast('Please select both people', 'error');
        return;
    }
    
    const mutual = socialNetwork.findMutualFriends(id1, id2);
    const p1 = socialNetwork.getPerson(id1);
    const p2 = socialNetwork.getPerson(id2);
    
    if (mutual.length === 0) {
        mutualResult.innerHTML = `<strong>${p1.name}</strong> and <strong>${p2.name}</strong> have no mutual friends.`;
    } else {
        const names = mutual.map(id => socialNetwork.getPerson(id).name);
        mutualResult.innerHTML = `
            <strong>Mutual Friends:</strong>
            <ul>${names.map(name => `<li>${name}</li>`).join('')}</ul>
        `;
    }
    
    mutualResult.classList.add('show');
});

// Suggest friends
suggestBtn.addEventListener('click', () => {
    const id = parseInt(suggestForPerson.value);
    
    if (!id) {
        showToast('Please select a person', 'error');
        return;
    }
    
    const suggestions = socialNetwork.suggestFriends(id);
    const person = socialNetwork.getPerson(id);
    
    if (suggestions.length === 0) {
        suggestResult.innerHTML = `<strong>No friend suggestions</strong> for ${person.name} at this time.`;
    } else {
        const html = suggestions.slice(0, 5).map(({ id: sugId, mutualCount }) => {
            const sugPerson = socialNetwork.getPerson(sugId);
            return `<li>${sugPerson.name} (${mutualCount} mutual friend${mutualCount > 1 ? 's' : ''})</li>`;
        }).join('');
        
        suggestResult.innerHTML = `
            <strong>Friend Suggestions for ${person.name}:</strong>
            <ul>${html}</ul>
        `;
    }
    
    suggestResult.classList.add('show');
});

// Calculate degrees of separation
degreeBtn.addEventListener('click', () => {
    const id1 = parseInt(degreePerson1.value);
    const id2 = parseInt(degreePerson2.value);
    
    if (!id1 || !id2) {
        showToast('Please select both people', 'error');
        return;
    }
    
    const degrees = socialNetwork.getDegreesOfSeparation(id1, id2);
    const p1 = socialNetwork.getPerson(id1);
    const p2 = socialNetwork.getPerson(id2);
    
    if (degrees === -1) {
        degreeResult.innerHTML = `<strong>${p1.name}</strong> and <strong>${p2.name}</strong> are not connected.`;
    } else if (degrees === 0) {
        degreeResult.innerHTML = `Same person!`;
    } else {
        degreeResult.innerHTML = `
            <strong>${degrees} degree${degrees > 1 ? 's' : ''} of separation</strong>
            <br>Between ${p1.name} and ${p2.name}
        `;
    }
    
    degreeResult.classList.add('show');
});

// Clear network
clearNetworkBtn.addEventListener('click', () => {
    if (confirm('Clear entire network? This cannot be undone.')) {
        socialNetwork.clear();
        nodePositions.clear();
        updateUI();
        showToast('🗑️ Network cleared');
    }
});

// Reset layout
resetLayoutBtn.addEventListener('click', () => {
    generateNodePositions();
    drawGraph();
    showToast('🔄 Layout reset');
});

// Toggle labels
toggleLabelsBtn.addEventListener('click', () => {
    showLabels = !showLabels;
    drawGraph();
    showToast(showLabels ? '🏷️ Labels shown' : '🏷️ Labels hidden');
});

// Update UI
function updateUI() {
    updateStats();
    updateSelects();
    drawGraph();
    renderPeopleList();
    
    // Hide/show overlay
    if (socialNetwork.people.size > 0) {
        graphOverlay.style.display = 'none';
    } else {
        graphOverlay.style.display = 'flex';
    }
}

function updateStats() {
    totalPeopleEl.textContent = socialNetwork.people.size;
    totalConnectionsEl.textContent = socialNetwork.getTotalConnections();
    avgFriendsEl.textContent = socialNetwork.getAverageFriends();
}

function updateSelects() {
    const people = socialNetwork.getAllPeople();
    
    const selects = [
        person1Select, person2Select,
        mutualPerson1, mutualPerson2,
        suggestForPerson,
        degreePerson1, degreePerson2
    ];
    
    selects.forEach(select => {
        const currentValue = select.value;
        const firstOption = select.querySelector('option').textContent;
        select.innerHTML = `<option value="">${firstOption}</option>`;
        
        people.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
            option.textContent = person.name;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    });
}

function generateNodePositions() {
    const people = socialNetwork.getAllPeople();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;
    
    people.forEach((person, index) => {
        const angle = (index / people.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        nodePositions.set(person.id, { x, y });
    });
}

function drawGraph() {
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const people = socialNetwork.getAllPeople();
    if (people.length === 0) return;
    
    // Draw edges first
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    
    people.forEach(person => {
        const pos1 = nodePositions.get(person.id);
        if (!pos1) return;
        
        person.friends.forEach(friendId => {
            if (friendId > person.id) { // Draw each edge once
                const pos2 = nodePositions.get(friendId);
                if (pos2) {
                    ctx.beginPath();
                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                    ctx.stroke();
                }
            }
        });
    });
    
    // Draw nodes
    people.forEach(person => {
        const pos = nodePositions.get(person.id);
        if (!pos) return;
        
        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = person.friends.length > 0 ? '#667eea' : '#adb5bd';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Avatar
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', pos.x, pos.y);
        
        // Label
        if (showLabels) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(person.name, pos.x, pos.y + 40);
        }
    });
}

function renderPeopleList() {
    const people = socialNetwork.getAllPeople();
    
    if (people.length === 0) {
        peopleListEl.innerHTML = '<p style="text-align:center;color:#adb5bd;">No people yet</p>';
        return;
    }
    
    peopleListEl.innerHTML = people.map(person => `
        <div class="person-card">
            <div class="person-avatar">👤</div>
            <div class="person-name">${person.name}</div>
            <div class="person-bio">${person.bio}</div>
            <div class="person-friends">${person.friends.length} friend${person.friends.length !== 1 ? 's' : ''}</div>
        </div>
    `).join('');
}

// Canvas drag functionality
function onCanvasMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on a node
    for (const [id, pos] of nodePositions.entries()) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (dx * dx + dy * dy <= 625) { // 25^2
            isDragging = true;
            draggedNode = id;
            break;
        }
    }
}

function onCanvasMouseMove(e) {
    if (isDragging && draggedNode !== null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        nodePositions.set(draggedNode, {
            x: Math.max(30, Math.min(canvas.width - 30, x)),
            y: Math.max(30, Math.min(canvas.height - 30, y))
        });
        
        drawGraph();
    }
}

function onCanvasMouseUp() {
    isDragging = false;
    draggedNode = null;
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#f44336' : '#333';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize
window.addEventListener('load', () => {
    initCanvas();
    updateUI();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (canvas) {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawGraph();
    }
});

