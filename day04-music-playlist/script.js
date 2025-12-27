// Node class for Doubly Linked List
class Node {
    constructor(song, artist, previewUrl = null, artworkUrl = null) {
        this.song = song;
        this.artist = artist;
        this.previewUrl = previewUrl;
        this.artworkUrl = artworkUrl;
        this.next = null;
        this.prev = null;
    }
}

// Doubly Linked List class
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // Add node at end - O(1)
    append(song, artist, previewUrl = null, artworkUrl = null) {
        const newNode = new Node(song, artist, previewUrl, artworkUrl);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.size++;
        return newNode;
    }

    // Add node at beginning - O(1)
    prepend(song, artist, previewUrl = null, artworkUrl = null) {
        const newNode = new Node(song, artist, previewUrl, artworkUrl);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        
        this.size++;
        return newNode;
    }

    // Insert after a specific node - O(1) when node is known
    insertAfter(node, song, artist, previewUrl = null, artworkUrl = null) {
        if (!node) return null;
        
        const newNode = new Node(song, artist, previewUrl, artworkUrl);
        
        newNode.prev = node;
        newNode.next = node.next;
        
        if (node.next) {
            node.next.prev = newNode;
        } else {
            this.tail = newNode;
        }
        
        node.next = newNode;
        this.size++;
        return newNode;
    }

    // Remove a specific node - O(1) when node is known
    remove(node) {
        if (!node) return false;
        
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
        
        this.size--;
        return true;
    }

    // Get all nodes as array
    toArray() {
        const arr = [];
        let current = this.head;
        
        while (current) {
            arr.push(current);
            current = current.next;
        }
        
        return arr;
    }

    // Clear all nodes
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // Shuffle (Fisher-Yates algorithm)
    shuffle() {
        const arr = this.toArray();
        
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        
        this.clear();
        
        arr.forEach(node => {
            this.append(node.song, node.artist, node.previewUrl, node.artworkUrl);
        });
    }
}

// Playlist Manager
class PlaylistManager {
    constructor() {
        this.playlist = new DoublyLinkedList();
        this.currentNode = null;
        this.isPlaying = false;
    }

    addSong(song, artist, position = 'end', previewUrl = null, artworkUrl = null) {
        let newNode;
        
        if (position === 'end') {
            newNode = this.playlist.append(song, artist, previewUrl, artworkUrl);
        } else if (position === 'start') {
            newNode = this.playlist.prepend(song, artist, previewUrl, artworkUrl);
        } else if (position === 'after' && this.currentNode) {
            newNode = this.playlist.insertAfter(this.currentNode, song, artist, previewUrl, artworkUrl);
        } else {
            newNode = this.playlist.append(song, artist, previewUrl, artworkUrl);
        }
        
        // If no current song, set as current
        if (!this.currentNode) {
            this.currentNode = newNode;
        }
        
        return newNode;
    }

    removeCurrent() {
        if (!this.currentNode) return false;
        
        const nodeToRemove = this.currentNode;
        
        // Move to next or prev before removing
        if (this.currentNode.next) {
            this.currentNode = this.currentNode.next;
        } else if (this.currentNode.prev) {
            this.currentNode = this.currentNode.prev;
        } else {
            this.currentNode = null;
        }
        
        this.playlist.remove(nodeToRemove);
        return true;
    }

    next() {
        if (this.currentNode && this.currentNode.next) {
            this.currentNode = this.currentNode.next;
            return this.currentNode;
        }
        return null;
    }

    previous() {
        if (this.currentNode && this.currentNode.prev) {
            this.currentNode = this.currentNode.prev;
            return this.currentNode;
        }
        return null;
    }

    play(node = null) {
        if (node) {
            this.currentNode = node;
        }
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
    }

    shuffle() {
        const currentSong = this.currentNode ? this.currentNode.song : null;
        this.playlist.shuffle();
        
        // Find current song in shuffled list
        if (currentSong) {
            let node = this.playlist.head;
            while (node) {
                if (node.song === currentSong) {
                    this.currentNode = node;
                    break;
                }
                node = node.next;
            }
        } else {
            this.currentNode = this.playlist.head;
        }
    }

    clearAll() {
        this.playlist.clear();
        this.currentNode = null;
        this.isPlaying = false;
    }

    getCurrentPosition() {
        if (!this.currentNode) return -1;
        
        let pos = 1;
        let node = this.playlist.head;
        
        while (node && node !== this.currentNode) {
            pos++;
            node = node.next;
        }
        
        return node ? pos : -1;
    }
}

// UI Controller
const playlistManager = new PlaylistManager();

const searchQueryInput = document.getElementById('searchQuery');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const searchResultsList = document.getElementById('searchResultsList');
const closeSearchBtn = document.getElementById('closeSearchBtn');

const songNameInput = document.getElementById('songName');
const artistNameInput = document.getElementById('artistName');
const addPositionSelect = document.getElementById('addPosition');
const addSongBtn = document.getElementById('addSongBtn');

const audioPlayer = document.getElementById('audioPlayer');
const albumArtImg = document.getElementById('albumArt');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');

const removeCurrentBtn = document.getElementById('removeCurrentBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');

const totalSongsEl = document.getElementById('totalSongs');
const currentPositionEl = document.getElementById('currentPosition');
const playlistCountEl = document.getElementById('playlistCount');

const linkedListDisplayEl = document.getElementById('linkedListDisplay');
const playlistDisplayEl = document.getElementById('playlistDisplay');
const toast = document.getElementById('toast');

// iTunes API Search
async function searchSongs() {
    const query = searchQueryInput.value.trim();
    
    if (!query) {
        showToast('Please enter a search term', 'error');
        return;
    }
    
    showToast('🔍 Searching iTunes...');
    
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=10`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            showToast('No results found', 'error');
        }
    } catch (error) {
        showToast('Search failed. Please try again.', 'error');
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    searchResultsList.innerHTML = results.map(track => `
        <div class="search-result-item" onclick='addFromSearch(${JSON.stringify({
            song: track.trackName,
            artist: track.artistName,
            preview: track.previewUrl,
            artwork: track.artworkUrl100
        })})'>
            <img src="${track.artworkUrl100}" alt="${track.trackName}" class="search-result-art" />
            <div class="search-result-info">
                <div class="search-result-song">${track.trackName}</div>
                <div class="search-result-artist">${track.artistName}</div>
            </div>
        </div>
    `).join('');
    
    searchResults.style.display = 'block';
}

function addFromSearch(trackData) {
    const position = addPositionSelect.value;
    playlistManager.addSong(trackData.song, trackData.artist, position, trackData.preview, trackData.artwork);
    
    searchResults.style.display = 'none';
    searchQueryInput.value = '';
    
    updateUI();
    showToast(`🎵 Added "${trackData.song}" to playlist`);
}

searchBtn.addEventListener('click', searchSongs);

searchQueryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchSongs();
    }
});

closeSearchBtn.addEventListener('click', () => {
    searchResults.style.display = 'none';
});

// Add song
function addSong() {
    const song = songNameInput.value.trim();
    const artist = artistNameInput.value.trim();
    
    if (!song || !artist) {
        showToast('Please enter both song and artist name', 'error');
        return;
    }
    
    const position = addPositionSelect.value;
    playlistManager.addSong(song, artist, position);
    
    songNameInput.value = '';
    artistNameInput.value = '';
    songNameInput.focus();
    
    updateUI();
    showToast(`🎵 Added "${song}" to playlist`);
}

addSongBtn.addEventListener('click', addSong);

songNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        artistNameInput.focus();
    }
});

artistNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addSong();
    }
});

// Audio Player Controls
function loadAndPlayAudio() {
    if (!playlistManager.currentNode) return;
    
    const node = playlistManager.currentNode;
    
    // Update now playing display
    updateNowPlaying();
    
    // Load and play audio if available
    if (node.previewUrl) {
        audioPlayer.src = node.previewUrl;
        if (playlistManager.isPlaying) {
            audioPlayer.play().catch(e => {
                console.error('Playback failed:', e);
                showToast('Playback failed', 'error');
            });
        }
    } else {
        audioPlayer.pause();
        audioPlayer.src = '';
        if (playlistManager.isPlaying) {
            showToast('No preview available for this song', 'error');
        }
    }
}

// Audio player event listeners
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percent + '%';
        
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
});

audioPlayer.addEventListener('ended', () => {
    // Auto-advance to next song
    if (playlistManager.next()) {
        loadAndPlayAudio();
        updateUI();
        showToast('⏭️ Next song');
    } else {
        playlistManager.pause();
        updateUI();
    }
});

// Progress bar click
progressBar.addEventListener('click', (e) => {
    if (audioPlayer.duration) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Player controls
playBtn.addEventListener('click', () => {
    playlistManager.togglePlay();
    
    if (playlistManager.isPlaying) {
        if (audioPlayer.src) {
            audioPlayer.play();
        }
        showToast('▶️ Playing');
    } else {
        audioPlayer.pause();
        showToast('⏸️ Paused');
    }
    
    updateUI();
});

prevBtn.addEventListener('click', () => {
    if (playlistManager.previous()) {
        loadAndPlayAudio();
        updateUI();
        showToast('⏮️ Previous song');
    }
});

nextBtn.addEventListener('click', () => {
    if (playlistManager.next()) {
        loadAndPlayAudio();
        updateUI();
        showToast('⏭️ Next song');
    }
});

// Actions
removeCurrentBtn.addEventListener('click', () => {
    if (confirm('Remove current song from playlist?')) {
        const current = playlistManager.currentNode;
        if (playlistManager.removeCurrent()) {
            // Stop audio if removed song was playing
            audioPlayer.pause();
            audioPlayer.src = '';
            
            // Load new current song if exists
            if (playlistManager.currentNode) {
                loadAndPlayAudio();
            } else {
                progressFill.style.width = '0%';
                currentTimeEl.textContent = '0:00';
                durationEl.textContent = '0:00';
            }
            
            updateUI();
            showToast(`🗑️ Removed "${current.song}"`);
        }
    }
});

shuffleBtn.addEventListener('click', () => {
    playlistManager.shuffle();
    updateUI();
    showToast('🔀 Playlist shuffled');
});

clearPlaylistBtn.addEventListener('click', () => {
    if (confirm('Clear entire playlist?')) {
        // Stop audio playback
        audioPlayer.pause();
        audioPlayer.src = '';
        
        // Reset progress
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        
        // Clear playlist
        playlistManager.clearAll();
        updateUI();
        showToast('❌ Playlist cleared');
    }
});

// Update UI
function updateUI() {
    const size = playlistManager.playlist.size;
    const currentPos = playlistManager.getCurrentPosition();
    
    // Update stats
    totalSongsEl.textContent = size;
    currentPositionEl.textContent = currentPos > 0 ? `${currentPos} / ${size}` : '-';
    playlistCountEl.textContent = `${size} song${size !== 1 ? 's' : ''}`;
    
    // Update button states
    const hasSongs = size > 0;
    const hasCurrent = playlistManager.currentNode !== null;
    
    playBtn.disabled = !hasCurrent;
    prevBtn.disabled = !hasCurrent || !playlistManager.currentNode.prev;
    nextBtn.disabled = !hasCurrent || !playlistManager.currentNode.next;
    removeCurrentBtn.disabled = !hasCurrent;
    shuffleBtn.disabled = !hasSongs;
    clearPlaylistBtn.disabled = !hasSongs;
    
    // Update play button icon
    playBtn.textContent = playlistManager.isPlaying ? '⏸️' : '▶️';
    playBtn.classList.toggle('playing', playlistManager.isPlaying);
    
    // Update now playing
    updateNowPlaying();
    
    // Update linked list visualization
    renderLinkedList();
    
    // Update playlist
    renderPlaylist();
}

function updateNowPlaying() {
    const nowPlayingEl = document.getElementById('nowPlaying');
    const titleEl = nowPlayingEl.querySelector('.song-title');
    const artistEl = nowPlayingEl.querySelector('.song-artist');
    
    if (playlistManager.currentNode) {
        titleEl.textContent = playlistManager.currentNode.song;
        artistEl.textContent = playlistManager.currentNode.artist;
        
        // Update album art
        if (playlistManager.currentNode.artworkUrl) {
            albumArtImg.src = playlistManager.currentNode.artworkUrl;
            albumArtImg.style.display = 'block';
        } else {
            albumArtImg.src = '';
            albumArtImg.style.display = 'none';
        }
    } else {
        titleEl.textContent = 'No song playing';
        artistEl.textContent = 'Select a song to start';
        albumArtImg.src = '';
        albumArtImg.style.display = 'none';
    }
}

function renderLinkedList() {
    if (playlistManager.playlist.size === 0) {
        linkedListDisplayEl.innerHTML = `
            <div class="empty-message">
                <p>Linked list is empty</p>
                <small>Add songs to see the linked list structure</small>
            </div>
        `;
        return;
    }
    
    const nodes = playlistManager.playlist.toArray();
    let html = '<div class="linked-list-container">';
    
    // Head label
    html += '<span class="head-label">HEAD</span>';
    
    nodes.forEach((node, index) => {
        const isCurrent = node === playlistManager.currentNode;
        
        html += `
            <div class="list-node ${isCurrent ? 'current' : ''}">
                <div class="node-label">${isCurrent ? '▶ Current' : `Node ${index + 1}`}</div>
                <div class="node-song">${node.song}</div>
                <div class="node-artist">${node.artist}</div>
                <div class="node-pointers">
                    <span>prev: ${node.prev ? '←' : 'null'}</span>
                    <span>next: ${node.next ? '→' : 'null'}</span>
                </div>
            </div>
        `;
        
        if (index < nodes.length - 1) {
            html += '<span class="arrow">→</span>';
        }
    });
    
    // Tail label
    html += '<span class="tail-label">TAIL</span>';
    html += '</div>';
    
    linkedListDisplayEl.innerHTML = html;
}

function renderPlaylist() {
    if (playlistManager.playlist.size === 0) {
        playlistDisplayEl.innerHTML = `
            <div class="empty-message">
                <p>Your playlist is empty</p>
                <small>Add songs above to get started!</small>
            </div>
        `;
        return;
    }
    
    const nodes = playlistManager.playlist.toArray();
    
    playlistDisplayEl.innerHTML = nodes.map((node, index) => {
        const isPlaying = node === playlistManager.currentNode;
        const icon = isPlaying ? '🎵' : '🎶';
        
        return `
            <div class="playlist-item ${isPlaying ? 'playing' : ''}" onclick="playFromPlaylist(${index})">
                <span class="playlist-item-number">${index + 1}</span>
                <span class="playlist-item-icon">${icon}</span>
                <div class="playlist-item-info">
                    <div class="playlist-item-song">${node.song}</div>
                    <div class="playlist-item-artist">${node.artist}</div>
                </div>
            </div>
        `;
    }).join('');
}

function playFromPlaylist(index) {
    const nodes = playlistManager.playlist.toArray();
    if (nodes[index]) {
        playlistManager.play(nodes[index]);
        loadAndPlayAudio();
        updateUI();
        showToast(`▶️ Now playing: ${nodes[index].song}`);
    }
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#f44336' : '#333';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Initialize with some sample songs with real audio
async function loadDefaultSongs() {
    const defaultSongs = [
        'Bohemian Rhapsody Queen',
        'Stairway to Heaven Led Zeppelin',
        'Hotel California Eagles'
    ];
    
    for (const query of defaultSongs) {
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const track = data.results[0];
                playlistManager.addSong(
                    track.trackName,
                    track.artistName,
                    'end',
                    track.previewUrl,
                    track.artworkUrl100
                );
            }
        } catch (error) {
            console.error('Failed to load default song:', query);
        }
    }
    
    updateUI();
    showToast('🎵 3 songs loaded with previews! Click play to listen.');
}

window.addEventListener('load', () => {
    loadDefaultSongs();
});

