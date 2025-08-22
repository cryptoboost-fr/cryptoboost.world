// Système de cache local pour réduire les appels à GitHub
const NodeCache = require('node-cache');

// Cache avec expiration de 5 minutes par défaut
const cache = new NodeCache({
    stdTTL: 300,
    checkperiod: 60,
    useClones: false
});

// Cache spécifique pour les données qui changent fréquemment
const volatileCache = new NodeCache({
    stdTTL: 30,  // 30 secondes
    checkperiod: 10,
    useClones: false
});

const CACHE_KEYS = {
    RATES: 'crypto_rates',
    TRANSACTIONS: 'transactions',
    WALLETS: 'wallets',
    USERS: 'users',
    SETTINGS: 'settings'
};

// Configuration du TTL par collection
const TTL_CONFIG = {
    crypto_rates: 30,     // 30 secondes pour les taux
    transactions: 60,     // 1 minute
    wallets: 60,         // 1 minute
    users: 300,          // 5 minutes
    settings: 600,       // 10 minutes
    default: 300         // 5 minutes par défaut
};

function getCacheTTL(collection) {
    return TTL_CONFIG[collection] || TTL_CONFIG.default;
}

// Fonction pour obtenir les données avec cache
async function getCachedData(collection, fetchFunction) {
    const cacheKey = `${collection}_data`;
    let data = cache.get(cacheKey);

    if (data === undefined) {
        try {
            data = await fetchFunction();
            cache.set(cacheKey, data, getCacheTTL(collection));
        } catch (error) {
            console.error(`Error fetching ${collection}:`, error);
            throw error;
        }
    }

    return data;
}

// Fonction pour mettre à jour le cache après une modification
function updateCache(collection, data) {
    const cacheKey = `${collection}_data`;
    cache.set(cacheKey, data, getCacheTTL(collection));
}

// Fonction pour invalider le cache d'une collection
function invalidateCache(collection) {
    const cacheKey = `${collection}_data`;
    cache.del(cacheKey);
}

// Stats du cache
function getCacheStats() {
    return {
        keys: cache.keys(),
        stats: cache.getStats(),
        volatileKeys: volatileCache.keys(),
        volatileStats: volatileCache.getStats()
    };
}

module.exports = {
    getCachedData,
    updateCache,
    invalidateCache,
    getCacheStats,
    CACHE_KEYS
};
