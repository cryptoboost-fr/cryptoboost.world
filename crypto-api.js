// CryptoBoost API Client
class CryptoAPI {
    constructor() {
        this.baseUrl = '/.netlify/functions/coinapi';
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds
        this.supportedPairs = ['BTC/EUR', 'ETH/EUR', 'USDT/EUR', 'USDC/EUR'];
        this.callbacks = new Map();
        
        // Démarrer les mises à jour en temps réel
        this.startRealtimeUpdates();
    }

    // Configuration des callbacks
    onPriceUpdate(callback) {
        if (typeof callback === 'function') {
            this.callbacks.set('priceUpdate', callback);
        }
    }

    onError(callback) {
        if (typeof callback === 'function') {
            this.callbacks.set('error', callback);
        }
    }

    // Obtenir tous les taux
    async getRates() {
        const cacheKey = 'rates';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${this.baseUrl}?action=rates&quote=EUR`);
            const data = await response.json();
            
            if (data.success) {
                this.setCache(cacheKey, data.data);
                return data.data;
            } else {
                throw new Error(data.message || 'Échec de récupération des taux');
            }
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Obtenir le taux pour une paire spécifique
    async getRate(pair) {
        if (!this.supportedPairs.includes(pair)) {
            throw new Error(`Paire de trading non supportée: ${pair}`);
        }

        const cacheKey = `rate_${pair}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${this.baseUrl}?action=rate&pair=${pair}`);
            const data = await response.json();
            
            if (data.success) {
                this.setCache(cacheKey, data.data);
                return data.data;
            } else {
                throw new Error(data.message || 'Échec de récupération du taux');
            }
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Obtenir l'historique des prix
    async getPriceHistory(pair, period = '24h') {
        if (!this.supportedPairs.includes(pair)) {
            throw new Error(`Paire de trading non supportée: ${pair}`);
        }

        const cacheKey = `history_${pair}_${period}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${this.baseUrl}?action=history&pair=${pair}&period=${period}`);
            const data = await response.json();
            
            if (data.success) {
                this.setCache(cacheKey, data.data);
                return data.data;
            } else {
                throw new Error(data.message || 'Échec de récupération de l\'historique');
            }
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Gestion du cache
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    // Mise à jour en temps réel
    startRealtimeUpdates() {
        setInterval(async () => {
            try {
                const rates = await this.getRates();
                const callback = this.callbacks.get('priceUpdate');
                if (callback) callback(rates);
            } catch (error) {
                this.handleError(error);
            }
        }, this.cacheTimeout);
    }

    // Gestion des erreurs
    handleError(error) {
        console.error('CryptoAPI Error:', error);
        const callback = this.callbacks.get('error');
        if (callback) callback(error);
    }

    // Calcul de conversion
    async calculateExchange(amount, fromCurrency, toCurrency) {
        try {
            const rates = await this.getRates();
            const fromRate = rates[fromCurrency];
            const toRate = rates[toCurrency];
            
            if (!fromRate || !toRate) {
                throw new Error('Paire de devises invalide');
            }
            
            const result = (amount * fromRate) / toRate;
            return {
                amount: result,
                rate: toRate / fromRate,
                timestamp: Date.now()
            };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Obtenir les frais de réseau estimés
    async getNetworkFees(currency) {
        try {
            const response = await fetch(`${this.baseUrl}?action=fees&currency=${currency}`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Échec de récupération des frais');
            }
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
}

// Créer une instance unique de l'API
const cryptoApi = new CryptoAPI();
export default cryptoApi;
