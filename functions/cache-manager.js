// Advanced Caching System for CryptoBoost
class CacheManager {
    constructor() {
        this.caches = {
            rates: new Map(),
            users: new Map(),
            transactions: new Map(),
            wallets: new Map()
        };

        this.config = {
            ttl: {
                rates: 5 * 60 * 1000,        // 5 minutes
                users: 15 * 60 * 1000,       // 15 minutes
                transactions: 60 * 1000,      // 1 minute
                wallets: 30 * 1000           // 30 seconds
            },
            maxSize: {
                rates: 100,
                users: 1000,
                transactions: 5000,
                wallets: 1000
            },
            priority: {
                rates: 1,
                users: 2,
                transactions: 3,
                wallets: 4
            }
        };

        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0
        };

        this.init();
    }

    init() {
        this.startCleanupInterval();
        this.setupStorageListener();
    }

    set(category, key, value) {
        if (!this.caches[category]) {
            throw new Error(`Invalid cache category: ${category}`);
        }

        // Check cache size limit
        if (this.caches[category].size >= this.config.maxSize[category]) {
            this.evictOldest(category);
        }

        const entry = {
            value,
            timestamp: Date.now(),
            accessCount: 0,
            priority: this.config.priority[category]
        };

        this.caches[category].set(key, entry);
        this.notifyUpdate(category, key, value);

        return true;
    }

    get(category, key) {
        if (!this.caches[category]) {
            throw new Error(`Invalid cache category: ${category}`);
        }

        const entry = this.caches[category].get(key);

        if (!entry) {
            this.stats.misses++;
            return null;
        }

        // Check if entry is expired
        if (this.isExpired(category, entry)) {
            this.caches[category].delete(key);
            this.stats.evictions++;
            return null;
        }

        // Update access statistics
        entry.accessCount++;
        entry.lastAccess = Date.now();
        this.stats.hits++;

        return entry.value;
    }

    isExpired(category, entry) {
        const now = Date.now();
        return (now - entry.timestamp) > this.config.ttl[category];
    }

    evictOldest(category) {
        let oldestKey = null;
        let oldestTimestamp = Infinity;

        for (const [key, entry] of this.caches[category]) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.caches[category].delete(oldestKey);
            this.stats.evictions++;
        }
    }

    clear(category = null) {
        if (category) {
            if (!this.caches[category]) {
                throw new Error(`Invalid cache category: ${category}`);
            }
            this.caches[category].clear();
        } else {
            Object.values(this.caches).forEach(cache => cache.clear());
        }

        this.notifyUpdate(category, null, null);
    }

    getStats() {
        const stats = { ...this.stats };
        
        // Add per-category statistics
        Object.keys(this.caches).forEach(category => {
            stats[category] = {
                size: this.caches[category].size,
                maxSize: this.config.maxSize[category],
                ttl: this.config.ttl[category]
            };
        });

        // Calculate hit rate
        stats.hitRate = (stats.hits / (stats.hits + stats.misses)) || 0;

        return stats;
    }

    startCleanupInterval() {
        setInterval(() => {
            this.cleanup();
        }, 60000); // Run cleanup every minute
    }

    cleanup() {
        const now = Date.now();
        let totalEvicted = 0;

        Object.entries(this.caches).forEach(([category, cache]) => {
            for (const [key, entry] of cache) {
                if (this.isExpired(category, entry)) {
                    cache.delete(key);
                    totalEvicted++;
                }
            }
        });

        if (totalEvicted > 0) {
            this.stats.evictions += totalEvicted;
            console.log(`[CacheManager] Cleaned up ${totalEvicted} expired entries`);
        }
    }

    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key && event.key.startsWith('cache:')) {
                const [_, category, key] = event.key.split(':');
                if (this.caches[category]) {
                    if (event.newValue === null) {
                        this.caches[category].delete(key);
                    } else {
                        try {
                            const value = JSON.parse(event.newValue);
                            this.set(category, key, value);
                        } catch (error) {
                            console.error('[CacheManager] Failed to parse storage update:', error);
                        }
                    }
                }
            }
        });
    }

    notifyUpdate(category, key, value) {
        if (category && key) {
            try {
                localStorage.setItem(
                    `cache:${category}:${key}`,
                    value ? JSON.stringify(value) : null
                );
            } catch (error) {
                console.warn('[CacheManager] Failed to notify update:', error);
            }
        }
    }

    preload(category, data) {
        if (!this.caches[category]) {
            throw new Error(`Invalid cache category: ${category}`);
        }

        Object.entries(data).forEach(([key, value]) => {
            this.set(category, key, value);
        });
    }
}

// Create global instance
window.cacheManager = new CacheManager();

// Export for module usage
export default CacheManager;
