// Tree Node class for Family Member
class FamilyMember {
    constructor(name, gender, birthYear) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.gender = gender;
        this.birthYear = birthYear;
        this.parent = null;
        this.spouse = null;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    setSpouse(spouse) {
        this.spouse = spouse;
        spouse.spouse = this;
    }

    getAge() {
        const currentYear = new Date().getFullYear();
        return this.birthYear ? currentYear - this.birthYear : null;
    }

    getIcon() {
        if (this.gender === 'male') return '👨';
        if (this.gender === 'female') return '👩';
        return '🧑';
    }
}

// Family Tree class
class FamilyTree {
    constructor() {
        this.root = null;
        this.members = new Map(); // id -> member
    }

    addRoot(name, gender, birthYear) {
        if (this.root) {
            throw new Error('Tree already has a root member');
        }
        const member = new FamilyMember(name, gender, birthYear);
        this.root = member;
        this.members.set(member.id, member);
        return member;
    }

    addMember(name, gender, birthYear) {
        const member = new FamilyMember(name, gender, birthYear);
        this.members.set(member.id, member);
        return member;
    }

    addChild(parentId, childName, childGender, childBirthYear) {
        const parent = this.members.get(parentId);
        if (!parent) throw new Error('Parent not found');

        const child = this.addMember(childName, childGender, childBirthYear);
        parent.addChild(child);
        return child;
    }

    addParent(childId, parentName, parentGender, parentBirthYear) {
        const child = this.members.get(childId);
        if (!child) throw new Error('Child not found');
        if (child.parent) throw new Error('Child already has a parent');

        const parent = this.addMember(parentName, parentGender, parentBirthYear);
        parent.addChild(child);
        
        // If child is root, make parent the new root
        if (this.root === child) {
            this.root = parent;
        }
        
        return parent;
    }

    addSpouse(memberId, spouseName, spouseGender, spouseBirthYear) {
        const member = this.members.get(memberId);
        if (!member) throw new Error('Member not found');
        if (member.spouse) throw new Error('Member already has a spouse');

        const spouse = this.addMember(spouseName, spouseGender, spouseBirthYear);
        member.setSpouse(spouse);
        return spouse;
    }

    removeMember(memberId) {
        const member = this.members.get(memberId);
        if (!member) return false;

        // Can't remove root if they have children
        if (member === this.root && member.children.length > 0) {
            throw new Error('Cannot remove root with children. Remove children first.');
        }

        // Remove from parent's children
        if (member.parent) {
            member.parent.removeChild(member);
        }

        // Remove spouse relationship
        if (member.spouse) {
            member.spouse.spouse = null;
        }

        // Remove all children (recursively)
        [...member.children].forEach(child => {
            this.removeMember(child.id);
        });

        // Remove from members map
        this.members.delete(memberId);

        // Update root if needed
        if (member === this.root) {
            this.root = null;
        }

        return true;
    }

    searchByName(name) {
        const results = [];
        const searchLower = name.toLowerCase();
        
        this.members.forEach(member => {
            if (member.name.toLowerCase().includes(searchLower)) {
                results.push(member);
            }
        });
        
        return results;
    }

    findRelationship(id1, id2) {
        const member1 = this.members.get(id1);
        const member2 = this.members.get(id2);
        
        if (!member1 || !member2) return null;
        if (id1 === id2) return 'Same person';

        // Check direct relationships
        if (member1.spouse === member2) return 'Spouse';
        if (member2.spouse === member1) return 'Spouse';
        if (member1.parent === member2) return 'Child of';
        if (member2.parent === member1) return 'Parent of';
        if (member1.children.includes(member2)) return 'Parent of';
        if (member2.children.includes(member1)) return 'Child of';

        // Check siblings
        if (member1.parent && member1.parent === member2.parent) {
            return 'Sibling';
        }

        // Check grandparent/grandchild
        if (member1.parent && member1.parent.parent === member2) return 'Grandchild of';
        if (member2.parent && member2.parent.parent === member1) return 'Grandparent of';

        // Check aunt/uncle relationships
        if (member1.parent) {
            const parent = member1.parent;
            if (parent.parent) {
                const grandparent = parent.parent;
                if (grandparent.children.includes(member2)) {
                    return 'Niece/Nephew of';
                }
            }
        }

        return 'Extended family';
    }

    getHeight() {
        if (!this.root) return 0;
        return this.getNodeHeight(this.root);
    }

    getNodeHeight(node) {
        if (!node || node.children.length === 0) return 1;
        
        let maxHeight = 0;
        node.children.forEach(child => {
            const childHeight = this.getNodeHeight(child);
            maxHeight = Math.max(maxHeight, childHeight);
        });
        
        return maxHeight + 1;
    }

    getTotalMembers() {
        return this.members.size;
    }

    clear() {
        this.root = null;
        this.members.clear();
    }

    getAllMembers() {
        return Array.from(this.members.values());
    }
}

// UI Controller
const familyTree = new FamilyTree();
let currentZoom = 1;

const memberNameInput = document.getElementById('memberName');
const memberGenderSelect = document.getElementById('memberGender');
const memberBirthYearInput = document.getElementById('memberBirthYear');
const relationshipTypeSelect = document.getElementById('relationshipType');
const relativeToSelect = document.getElementById('relativeTo');
const addMemberBtn = document.getElementById('addMemberBtn');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const person1Select = document.getElementById('person1Select');
const person2Select = document.getElementById('person2Select');
const findRelationBtn = document.getElementById('findRelationBtn');
const relationshipResult = document.getElementById('relationshipResult');

const totalMembersEl = document.getElementById('totalMembers');
const totalGenerationsEl = document.getElementById('totalGenerations');
const treeHeightEl = document.getElementById('treeHeight');

const expandAllBtn = document.getElementById('expandAllBtn');
const collapseAllBtn = document.getElementById('collapseAllBtn');
const clearTreeBtn = document.getElementById('clearTreeBtn');

const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');
const zoomLevelEl = document.getElementById('zoomLevel');

const treeDisplay = document.getElementById('treeDisplay');
const toast = document.getElementById('toast');

// Enable/disable relative selector based on relationship type
relationshipTypeSelect.addEventListener('change', () => {
    const type = relationshipTypeSelect.value;
    if (type === 'root') {
        relativeToSelect.disabled = true;
    } else {
        relativeToSelect.disabled = false;
        updateRelativeToOptions();
    }
});

function updateRelativeToOptions() {
    const members = familyTree.getAllMembers();
    relativeToSelect.innerHTML = '<option value="">Select person...</option>';
    
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = `${member.name} (${member.getAge() ? member.getAge() + ' yrs' : 'Age N/A'})`;
        relativeToSelect.appendChild(option);
    });
}

function updatePersonSelectors() {
    const members = familyTree.getAllMembers();
    
    [person1Select, person2Select].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select person...</option>';
        
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    });
}

// Add member
function addMember() {
    const name = memberNameInput.value.trim();
    const gender = memberGenderSelect.value;
    const birthYear = parseInt(memberBirthYearInput.value) || null;
    const relationType = relationshipTypeSelect.value;
    const relativeId = parseFloat(relativeToSelect.value);

    if (!name) {
        showToast('Please enter a name', 'error');
        return;
    }

    try {
        let newMember;

        if (relationType === 'root') {
            newMember = familyTree.addRoot(name, gender, birthYear);
            showToast(`👤 Added ${name} as root of the tree`);
        } else if (relationType === 'child') {
            if (!relativeId) {
                showToast('Please select a parent', 'error');
                return;
            }
            newMember = familyTree.addChild(relativeId, name, gender, birthYear);
            showToast(`👶 Added ${name} as child`);
        } else if (relationType === 'parent') {
            if (!relativeId) {
                showToast('Please select a child', 'error');
                return;
            }
            newMember = familyTree.addParent(relativeId, name, gender, birthYear);
            showToast(`👨‍👩 Added ${name} as parent`);
        } else if (relationType === 'spouse') {
            if (!relativeId) {
                showToast('Please select a person', 'error');
                return;
            }
            newMember = familyTree.addSpouse(relativeId, name, gender, birthYear);
            showToast(`💑 Added ${name} as spouse`);
        }

        // Clear inputs
        memberNameInput.value = '';
        memberBirthYearInput.value = '';
        
        updateUI();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

addMemberBtn.addEventListener('click', addMember);

memberNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addMember();
    }
});

// Search
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        showToast('Please enter a search term', 'error');
        return;
    }

    const results = familyTree.searchByName(query);
    
    if (results.length === 0) {
        showToast('No members found', 'error');
        renderTree();
    } else {
        showToast(`Found ${results.length} member(s)`);
        renderTree(results.map(m => m.id));
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Find relationship
findRelationBtn.addEventListener('click', () => {
    const id1 = parseFloat(person1Select.value);
    const id2 = parseFloat(person2Select.value);

    if (!id1 || !id2) {
        showToast('Please select both people', 'error');
        return;
    }

    const relation = familyTree.findRelationship(id1, id2);
    const member1 = familyTree.members.get(id1);
    const member2 = familyTree.members.get(id2);

    if (relation) {
        relationshipResult.innerHTML = `
            <strong>${member1.name}</strong> is <strong>${relation}</strong> to <strong>${member2.name}</strong>
        `;
        relationshipResult.classList.add('show');
    }
});

// Tree actions
clearTreeBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire family tree?')) {
        familyTree.clear();
        updateUI();
        showToast('🗑️ Family tree cleared');
    }
});

// Zoom controls
zoomInBtn.addEventListener('click', () => {
    currentZoom = Math.min(currentZoom + 0.1, 2);
    applyZoom();
});

zoomOutBtn.addEventListener('click', () => {
    currentZoom = Math.max(currentZoom - 0.1, 0.5);
    applyZoom();
});

resetZoomBtn.addEventListener('click', () => {
    currentZoom = 1;
    applyZoom();
});

function applyZoom() {
    treeDisplay.style.transform = `scale(${currentZoom})`;
    zoomLevelEl.textContent = Math.round(currentZoom * 100) + '%';
}

// Update UI
function updateUI() {
    updateRelativeToOptions();
    updatePersonSelectors();
    updateStats();
    renderTree();
}

function updateStats() {
    totalMembersEl.textContent = familyTree.getTotalMembers();
    treeHeightEl.textContent = familyTree.getHeight();
    totalGenerationsEl.textContent = familyTree.getHeight();
}

// Render tree
function renderTree(highlightIds = []) {
    if (!familyTree.root) {
        treeDisplay.innerHTML = `
            <div class="empty-tree">
                <div class="empty-icon">🌳</div>
                <p>Your family tree is empty</p>
                <small>Add your first family member to get started!</small>
            </div>
        `;
        return;
    }

    treeDisplay.innerHTML = renderNode(familyTree.root, highlightIds);
    
    // Attach event listeners to action buttons
    attachActionListeners();
}

function attachActionListeners() {
    document.querySelectorAll('.person-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action');
            const memberId = parseFloat(btn.getAttribute('data-member-id'));
            
            if (action === 'spouse') {
                addSpouseQuick(memberId);
            } else if (action === 'child') {
                addChildQuick(memberId);
            } else if (action === 'delete') {
                deleteMember(memberId);
            }
        });
    });
}

function renderNode(member, highlightIds = []) {
    const isHighlighted = highlightIds.includes(member.id);
    const age = member.getAge();
    
    let html = '<div class="tree-node">';
    
    // Check if member has spouse
    if (member.spouse) {
        html += '<div class="spouse-container">';
        html += renderPersonCard(member, isHighlighted);
        html += '<div class="marriage-line"></div>';
        html += renderPersonCard(member.spouse, highlightIds.includes(member.spouse.id));
        html += '</div>';
    } else {
        html += renderPersonCard(member, isHighlighted);
    }
    
    // Render children
    if (member.children.length > 0) {
        html += '<div class="children-container">';
        member.children.forEach(child => {
            html += renderNode(child, highlightIds);
        });
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

function renderPersonCard(member, isHighlighted) {
    const age = member.getAge();
    return `
        <div class="person-card ${isHighlighted ? 'highlighted' : ''}" data-id="${member.id}">
            <div class="person-avatar">${member.getIcon()}</div>
            <div class="person-name">${member.name}</div>
            <div class="person-details">
                ${age ? age + ' years old' : 'Age N/A'}
                ${member.birthYear ? '(b. ' + member.birthYear + ')' : ''}
            </div>
            <div class="person-actions">
                ${!member.spouse ? `<button class="person-action-btn btn-spouse" data-action="spouse" data-member-id="${member.id}">💑 Spouse</button>` : ''}
                <button class="person-action-btn btn-child" data-action="child" data-member-id="${member.id}">👶 Child</button>
                <button class="person-action-btn btn-delete" data-action="delete" data-member-id="${member.id}">🗑️</button>
            </div>
        </div>
    `;
}

// Quick actions
function addSpouseQuick(memberId) {
    const member = familyTree.members.get(memberId);
    const spouseName = prompt(`Enter spouse name for ${member.name}:`);
    
    if (spouseName) {
        const gender = prompt('Enter gender (male/female/other):', 'other');
        const birthYear = prompt('Enter birth year (optional):', '');
        
        try {
            familyTree.addSpouse(memberId, spouseName, gender || 'other', parseInt(birthYear) || null);
            updateUI();
            showToast(`💑 Added ${spouseName} as spouse`);
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

function addChildQuick(parentId) {
    const parent = familyTree.members.get(parentId);
    const childName = prompt(`Enter child name for ${parent.name}:`);
    
    if (childName) {
        const gender = prompt('Enter gender (male/female/other):', 'other');
        const birthYear = prompt('Enter birth year (optional):', '');
        
        try {
            familyTree.addChild(parentId, childName, gender || 'other', parseInt(birthYear) || null);
            updateUI();
            showToast(`👶 Added ${childName} as child`);
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

function deleteMember(memberId) {
    const member = familyTree.members.get(memberId);
    
    if (confirm(`Delete ${member.name}? This will also remove all their descendants.`)) {
        try {
            familyTree.removeMember(memberId);
            updateUI();
            showToast(`🗑️ Removed ${member.name} from tree`);
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
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
updateUI();

