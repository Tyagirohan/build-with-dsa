// Stack implementation
class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
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

// URL Helper
function normalizeURL(url) {
    // Remove whitespace
    url = url.trim();
    
    // Add https:// if no protocol specified
    if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
    }
    
    return url;
}

// Browser History Manager
class BrowserHistory {
    constructor() {
        this.backStack = new Stack();
        this.forwardStack = new Stack();
        this.currentPage = "Welcome Page";
        this.currentURL = null;
    }

    visit(url) {
        if (!url || url.trim() === "") {
            return;
        }

        // Normalize URL
        const normalizedURL = normalizeURL(url);

        // Push current page to back stack
        if (this.currentPage !== "Welcome Page") {
            this.backStack.push({
                display: this.currentPage,
                url: this.currentURL
            });
        }

        // Clear forward stack when visiting new page
        this.forwardStack.clear();

        // Set new current page
        this.currentPage = url;
        this.currentURL = normalizedURL;
    }

    back() {
        if (this.backStack.isEmpty()) {
            return;
        }

        // Push current page to forward stack
        this.forwardStack.push({
            display: this.currentPage,
            url: this.currentURL
        });

        // Pop from back stack and set as current
        const previous = this.backStack.pop();
        this.currentPage = previous.display;
        this.currentURL = previous.url;
    }

    forward() {
        if (this.forwardStack.isEmpty()) {
            return;
        }

        // Push current page to back stack
        this.backStack.push({
            display: this.currentPage,
            url: this.currentURL
        });

        // Pop from forward stack and set as current
        const next = this.forwardStack.pop();
        this.currentPage = next.display;
        this.currentURL = next.url;
    }

    canGoBack() {
        return !this.backStack.isEmpty();
    }

    canGoForward() {
        return !this.forwardStack.isEmpty();
    }
}

// UI Controller
const browserHistory = new BrowserHistory();

const urlInput = document.getElementById('urlInput');
const visitBtn = document.getElementById('visitBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const currentUrl = document.getElementById('currentUrl');
const backStackEl = document.getElementById('backStack');
const forwardStackEl = document.getElementById('forwardStack');

// Website viewer elements
const welcomeScreen = document.getElementById('welcomeScreen');
const loadingScreen = document.getElementById('loadingScreen');
const blockedScreen = document.getElementById('blockedScreen');
const frameContainer = document.getElementById('frameContainer');
const websiteFrame = document.getElementById('websiteFrame');
const openExternalBtn = document.getElementById('openExternalBtn');
const openFrameExternal = document.getElementById('openFrameExternal');
const frameUrl = document.getElementById('frameUrl');
const blockedSiteName = document.getElementById('blockedSiteName');

let currentExternalURL = null;

// List of known sites that block iframe embedding
const BLOCKED_SITES = [
    'google.com',
    'youtube.com',
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'x.com',
    'netflix.com',
    'amazon.com',
    'linkedin.com',
    'reddit.com'
];

function updateUI() {
    // Update current page display
    currentUrl.textContent = browserHistory.currentPage;

    // Update back button state
    backBtn.disabled = !browserHistory.canGoBack();

    // Update forward button state
    forwardBtn.disabled = !browserHistory.canGoForward();

    // Update back stack visualization
    const backItems = browserHistory.backStack.getAll().map(item => 
        typeof item === 'string' ? item : item.display
    );
    renderStack(backStackEl, backItems);

    // Update forward stack visualization
    const forwardItems = browserHistory.forwardStack.getAll().map(item => 
        typeof item === 'string' ? item : item.display
    );
    renderStack(forwardStackEl, forwardItems);

    // Load website in iframe
    loadWebsite(browserHistory.currentURL);
}

function renderStack(container, items) {
    container.innerHTML = '';

    if (items.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-stack';
        emptyMsg.textContent = 'Empty';
        container.appendChild(emptyMsg);
        return;
    }

    items.forEach(item => {
        const stackItem = document.createElement('div');
        stackItem.className = 'stack-item';
        stackItem.textContent = item;
        container.appendChild(stackItem);
    });
}

function showScreen(screen) {
    welcomeScreen.style.display = 'none';
    loadingScreen.style.display = 'none';
    blockedScreen.style.display = 'none';
    frameContainer.style.display = 'none';

    if (screen === 'welcome') {
        welcomeScreen.style.display = 'flex';
    } else if (screen === 'loading') {
        loadingScreen.style.display = 'flex';
    } else if (screen === 'blocked') {
        blockedScreen.style.display = 'flex';
    } else if (screen === 'frame') {
        frameContainer.style.display = 'flex';
    }
}

function isLikelyBlocked(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        
        return BLOCKED_SITES.some(blocked => 
            hostname.includes(blocked) || blocked.includes(hostname)
        );
    } catch (e) {
        return false;
    }
}

function getDisplayName(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        return url;
    }
}

function loadWebsite(url) {
    if (!url) {
        showScreen('welcome');
        return;
    }

    currentExternalURL = url;
    
    // Check if site is known to block iframes
    if (isLikelyBlocked(url)) {
        blockedSiteName.textContent = getDisplayName(url);
        showScreen('blocked');
        return;
    }

    showScreen('loading');

    // Update frame toolbar
    frameUrl.textContent = getDisplayName(url);

    // Set iframe source
    websiteFrame.src = url;

    // Set a timeout to detect if the iframe loads
    let loaded = false;
    const loadTimeout = setTimeout(() => {
        if (!loaded) {
            // If not loaded in 3 seconds, might be blocked
            blockedSiteName.textContent = getDisplayName(url);
            showScreen('blocked');
        }
    }, 3000);

    // Try to detect successful load
    websiteFrame.onload = () => {
        loaded = true;
        clearTimeout(loadTimeout);
        
        // Small delay to check if content actually loaded
        setTimeout(() => {
            try {
                // Try to access iframe - will fail if CORS blocks it
                const iframeWin = websiteFrame.contentWindow;
                
                // If we got here without exception, try to check location
                try {
                    const loc = iframeWin.location.href;
                    if (loc === 'about:blank' || loc !== url) {
                        // Might be blocked
                        blockedSiteName.textContent = getDisplayName(url);
                        showScreen('blocked');
                    } else {
                        showScreen('frame');
                    }
                } catch (e) {
                    // CORS blocked - but might still show content
                    showScreen('frame');
                }
            } catch (e) {
                // Completely blocked
                showScreen('frame');
            }
        }, 100);
    };

    // Detect if iframe fails to load
    websiteFrame.onerror = () => {
        loaded = true;
        clearTimeout(loadTimeout);
        blockedSiteName.textContent = getDisplayName(url);
        showScreen('blocked');
    };
}

function visitPage() {
    const url = urlInput.value.trim();
    if (url) {
        browserHistory.visit(url);
        urlInput.value = '';
        updateUI();
        
        // Add visual feedback
        currentUrl.style.animation = 'none';
        setTimeout(() => {
            currentUrl.style.animation = 'stackPush 0.3s ease-out';
        }, 10);
    }
}

// Event Listeners
visitBtn.addEventListener('click', visitPage);

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        visitPage();
    }
});

backBtn.addEventListener('click', () => {
    browserHistory.back();
    updateUI();
});

forwardBtn.addEventListener('click', () => {
    browserHistory.forward();
    updateUI();
});

openExternalBtn.addEventListener('click', () => {
    if (currentExternalURL) {
        window.open(currentExternalURL, '_blank');
    }
});

openFrameExternal.addEventListener('click', () => {
    if (currentExternalURL) {
        window.open(currentExternalURL, '_blank');
    }
});

// Initialize UI
updateUI();

