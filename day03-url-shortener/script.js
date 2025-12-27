// HashMap implementation (using JavaScript Object)
class URLShortener {
    constructor() {
        // HashMap: key = short code, value = URL data
        this.urlMap = new Map();
        this.baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
    }

    // Generate random short code
    generateShortCode(length = 6) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        // Check if code already exists (hash collision handling)
        if (this.urlMap.has(code)) {
            return this.generateShortCode(length);
        }
        return code;
    }

    // Validate URL
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Shorten URL - O(1) insertion
    shortenURL(longUrl, customCode = null) {
        if (!this.isValidURL(longUrl)) {
            throw new Error('Invalid URL');
        }

        let shortCode = customCode;
        
        if (customCode) {
            // Validate custom code
            if (!/^[a-zA-Z0-9-_]+$/.test(customCode)) {
                throw new Error('Custom code can only contain letters, numbers, hyphens, and underscores');
            }
            if (this.urlMap.has(customCode)) {
                throw new Error('This custom code is already taken');
            }
        } else {
            shortCode = this.generateShortCode();
        }

        // Store in HashMap - O(1) operation
        const urlData = {
            longUrl,
            shortCode,
            clicks: 0,
            createdAt: new Date()
        };

        this.urlMap.set(shortCode, urlData);
        return {
            shortUrl: this.baseUrl + shortCode,
            shortCode,
            longUrl
        };
    }

    // Lookup URL - O(1) operation
    getOriginalURL(shortCode) {
        return this.urlMap.get(shortCode);
    }

    // Track click - O(1) operation
    trackClick(shortCode) {
        const urlData = this.urlMap.get(shortCode);
        if (urlData) {
            urlData.clicks++;
            return urlData;
        }
        return null;
    }

    // Delete URL - O(1) operation
    deleteURL(shortCode) {
        return this.urlMap.delete(shortCode);
    }

    // Get all URLs
    getAllURLs() {
        return Array.from(this.urlMap.values());
    }

    // Get stats
    getStats() {
        const urls = this.getAllURLs();
        const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
        return {
            totalUrls: urls.length,
            totalClicks
        };
    }

    // Clear all
    clearAll() {
        this.urlMap.clear();
    }
}

// UI Controller
const urlShortener = new URLShortener();

const longUrlInput = document.getElementById('longUrl');
const customToggle = document.getElementById('customToggle');
const customCodeInput = document.getElementById('customCode');
const shortenBtn = document.getElementById('shortenBtn');
const resultBox = document.getElementById('result');
const shortUrlDisplay = document.getElementById('shortUrl');
const originalUrlDisplay = document.getElementById('originalUrl');
const copyBtn = document.getElementById('copyBtn');

const totalUrlsEl = document.getElementById('totalUrls');
const totalClicksEl = document.getElementById('totalClicks');
const hashmapDisplayEl = document.getElementById('hashmapDisplay');
const urlsListEl = document.getElementById('urlsList');
const clearAllBtn = document.getElementById('clearAllBtn');
const toast = document.getElementById('toast');

// Toggle custom code input
customToggle.addEventListener('change', () => {
    customCodeInput.disabled = !customToggle.checked;
    if (customToggle.checked) {
        customCodeInput.focus();
    } else {
        customCodeInput.value = '';
    }
});

// Shorten URL
function shortenURL() {
    const longUrl = longUrlInput.value.trim();
    
    if (!longUrl) {
        showToast('Please enter a URL', 'error');
        longUrlInput.focus();
        return;
    }

    try {
        const customCode = customToggle.checked ? customCodeInput.value.trim() : null;
        const result = urlShortener.shortenURL(longUrl, customCode);
        
        // Show result
        shortUrlDisplay.textContent = result.shortUrl;
        originalUrlDisplay.textContent = result.longUrl;
        resultBox.style.display = 'block';
        
        // Clear inputs
        longUrlInput.value = '';
        customCodeInput.value = '';
        customToggle.checked = false;
        customCodeInput.disabled = true;
        
        // Update UI
        updateUI();
        showToast('✅ URL shortened successfully!');
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

shortenBtn.addEventListener('click', shortenURL);

longUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenURL();
    }
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    const shortUrl = shortUrlDisplay.textContent;
    navigator.clipboard.writeText(shortUrl).then(() => {
        showToast('📋 Copied to clipboard!');
    });
});

// Visit URL (simulate click tracking)
function visitURL(shortCode) {
    const urlData = urlShortener.trackClick(shortCode);
    if (urlData) {
        window.open(urlData.longUrl, '_blank');
        updateUI();
        showToast('🚀 Redirecting...');
    }
}

// Delete URL
function deleteURL(shortCode) {
    if (confirm('Are you sure you want to delete this URL?')) {
        urlShortener.deleteURL(shortCode);
        updateUI();
        showToast('🗑️ URL deleted');
    }
}

// Clear all URLs
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete ALL URLs?')) {
        urlShortener.clearAll();
        resultBox.style.display = 'none';
        updateUI();
        showToast('🗑️ All URLs cleared');
    }
});

// Update UI
function updateUI() {
    const stats = urlShortener.getStats();
    const urls = urlShortener.getAllURLs();
    
    // Update stats
    totalUrlsEl.textContent = stats.totalUrls;
    totalClicksEl.textContent = stats.totalClicks;
    
    // Update clear button
    clearAllBtn.disabled = stats.totalUrls === 0;
    
    // Update hashmap visualization
    renderHashMap(urls);
    
    // Update URLs list
    renderURLsList(urls);
}

function renderHashMap(urls) {
    if (urls.length === 0) {
        hashmapDisplayEl.innerHTML = `
            <div class="empty-message">
                <p>No URLs shortened yet</p>
                <small>Add your first URL above!</small>
            </div>
        `;
        return;
    }

    hashmapDisplayEl.innerHTML = urls.map(url => `
        <div class="hashmap-entry">
            <span class="hashmap-key">"${url.shortCode}"</span>
            <span class="hashmap-arrow">→</span>
            <span class="hashmap-value">{ url: "${url.longUrl.substring(0, 40)}${url.longUrl.length > 40 ? '...' : ''}", clicks: ${url.clicks} }</span>
        </div>
    `).join('');
}

function renderURLsList(urls) {
    if (urls.length === 0) {
        urlsListEl.innerHTML = `
            <div class="empty-message">
                <p>No URLs yet</p>
            </div>
        `;
        return;
    }

    // Sort by creation date (newest first)
    const sortedUrls = [...urls].sort((a, b) => b.createdAt - a.createdAt);

    urlsListEl.innerHTML = sortedUrls.map(url => {
        const shortUrl = urlShortener.baseUrl + url.shortCode;
        return `
            <div class="url-item">
                <div class="url-item-header">
                    <div class="url-short">${shortUrl}</div>
                    <div class="url-clicks">👆 ${url.clicks} clicks</div>
                </div>
                <div class="url-long">${url.longUrl}</div>
                <div class="url-actions">
                    <button class="btn-action btn-visit" onclick="visitURL('${url.shortCode}')">🔗 Visit</button>
                    <button class="btn-action btn-delete" onclick="deleteURL('${url.shortCode}')">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#f44336' : '#333';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize UI
updateUI();

// Add some sample URLs for demo
window.addEventListener('load', () => {
    try {
        urlShortener.shortenURL('https://github.com/Tyagirohan/build-with-dsa', 'github');
        urlShortener.shortenURL('https://www.linkedin.com/in/rohan-tyagi-333675202/', 'linkedin');
        updateUI();
    } catch (e) {
        // Ignore errors on demo data
    }
});

