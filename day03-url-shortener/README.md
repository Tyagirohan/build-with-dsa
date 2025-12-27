# Day 3: URL Shortener 🔗

## DSA Concept: Hash Map (Hash Table / Dictionary)

### What is a Hash Map?
A hash map is a data structure that implements an associative array, mapping keys to values. It uses a hash function to compute an index into an array of buckets, from which the desired value can be found.

**Core Operations:**
- `set(key, value)` - Store key-value pair (O(1) average)
- `get(key)` - Retrieve value by key (O(1) average)
- `has(key)` - Check if key exists (O(1) average)
- `delete(key)` - Remove key-value pair (O(1) average)

### Real-World Application: URL Shortener

This project demonstrates how hash maps power URL shortening services like bit.ly, tinyurl.com:

1. **Short Code → URL Mapping**: Store URLs with short codes as keys
2. **O(1) Lookup**: Retrieve original URL instantly
3. **Collision Handling**: Generate unique codes automatically
4. **Click Tracking**: Update stats in constant time

#### How It Works:

**Shortening a URL:**
```javascript
shortCode = generateUniqueCode()  // or custom code
hashMap.set(shortCode, urlData)   // O(1) insertion
return shortUrl
```

**Redirecting (Lookup):**
```javascript
urlData = hashMap.get(shortCode)  // O(1) lookup
redirect(urlData.longUrl)
urlData.clicks++                   // O(1) update
```

**Custom vs Auto Code:**
```
Auto: Random 6-char code (aB3xY9)
Custom: User-defined (my-link)
Both use same O(1) hash map operations
```

### Tech Stack
- Vanilla JavaScript (ES6+ with Map object)
- HTML5
- CSS3 (with gradients & animations)

### Features
✅ **Auto short code generation** - 6-character random codes  
✅ **Custom short codes** - Use your own memorable codes  
✅ **Click tracking** - Count visits for each URL  
✅ **Hash map visualization** - See key-value pairs  
✅ **Copy to clipboard** - One-click copy  
✅ **URL management** - View, visit, and delete URLs  
✅ **Real-time stats** - Total URLs and clicks  
✅ **Collision handling** - Automatic unique code generation  
✅ **Toast notifications** - User-friendly feedback  

### How to Run
1. Clone this repository
2. Open `index.html` in your browser
3. No build process or dependencies needed!

### Time Complexity
- **Shorten URL**: O(1) average
- **Lookup URL**: O(1) average
- **Track click**: O(1) average
- **Delete URL**: O(1) average

### Space Complexity
**O(n)** - where n is the number of URLs stored

### Interactive Features
- **Shorten URL**: Paste long URL, get short link
- **Custom Codes**: Toggle to use your own codes
- **Visit Links**: Click to open original URL (tracks clicks!)
- **Delete URLs**: Remove unwanted shortened URLs
- **Clear All**: Reset entire shortener
- **Copy Button**: Copy short URL to clipboard

### What I Learned
- Hash map operations and O(1) lookup
- How URL shorteners work under the hood
- Hash collision handling strategies
- Key-value pair data structures
- Base62 encoding concept (not implemented, but related)

### Real-World Applications
- **bit.ly, TinyURL**: Commercial URL shorteners
- **Caching Systems**: Redis, Memcached use hash maps
- **Databases**: Indexing with hash tables
- **Symbol Tables**: Compilers and interpreters
- **DNS Resolution**: Domain name to IP mapping
- **Session Management**: Web application sessions

### Limitations & Production Considerations
This is an educational demo. Production URL shorteners need:
- **Persistent storage** (database, not just memory)
- **Distributed systems** (millions of URLs)
- **Analytics** (detailed click tracking)
- **Security** (abuse prevention, malware scanning)
- **Custom domains** (your.domain/code)
- **Expiration** (auto-delete old links)

### Next Steps
Day 4 will explore another data structure - stay tuned! 🚀

---

**Part of #DSAInPublic series** | [View all projects](https://github.com/Tyagirohan/build-with-dsa)

