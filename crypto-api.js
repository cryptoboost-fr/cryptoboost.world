// CryptoBoost API Client for Real-time Crypto Rates
class CryptoAPI {
    constructor() {
        this.baseUrl = '/.netlify/functions/coinapi';
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds
    }

    // Get all crypto rates
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
            }
            throw new Error(data.error || 'Failed to fetch rates');
        } catch (error) {
            console.error('Error fetching crypto rates:', error);
            return this.getFallbackRates();
        }
    }

    // Get specific crypto price
    async getPrice(symbol) {
        try {
            const response = await fetch(`${this.baseUrl}?action=price&from=${symbol}&quote=EUR`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            }
            throw new Error(data.error || 'Failed to fetch price');
        } catch (error) {
            console.error(`Error fetching ${symbol} price:`, error);
            const fallback = this.getFallbackRates();
            return {
                symbol: symbol,
                price: fallback[symbol]?.price || 0,
                change_24h: fallback[symbol]?.change_24h || 0,
                last_updated: new Date().toISOString()
            };
        }
    }

    // Convert between cryptocurrencies
    async convert(from, to, amount) {
        try {
            const response = await fetch(`${this.baseUrl}?action=convert&from=${from}&to=${to}&amount=${amount}&quote=EUR`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            }
            throw new Error(data.error || 'Failed to convert');
        } catch (error) {
            console.error(`Error converting ${from} to ${to}:`, error);
            // Fallback conversion using cached rates
            const rates = await this.getRates();
            const fromRate = rates[from.toUpperCase()];
            const toRate = rates[to.toUpperCase()];
            
            if (fromRate && toRate) {
                const fromUSD = amount * fromRate.price;
                const result = fromUSD / toRate.price;
                
                return {
                    from: from.toUpperCase(),
                    to: to.toUpperCase(),
                    amount: amount,
                    result: result,
                    rate: fromRate.price / toRate.price,
                    usd_value: fromUSD,
                    timestamp: new Date().toISOString()
                };
            }
            
            throw error;
        }
    }

    // Update crypto rates in UI elements
    async updateRatesInUI() {
        try {
            const rates = await this.getRates();
            
            // Update price displays
            Object.entries(rates).forEach(([symbol, data]) => {
                const priceElements = document.querySelectorAll(`[data-crypto="${symbol}"]`);
                priceElements.forEach(element => {
                    if (element.dataset.field === 'price') {
                        element.textContent = this.formatPrice(data.price);
                    } else if (element.dataset.field === 'change') {
                        element.textContent = this.formatChange(data.change_24h);
                        element.className = element.className.replace(/text-(red|green)-\d+/, '');
                        element.classList.add(data.change_24h >= 0 ? 'text-green-400' : 'text-red-400');
                    }
                });
            });

            // Update portfolio values
            this.updatePortfolioValues(rates);
            
            // Update last updated timestamp
            const timestampElements = document.querySelectorAll('.crypto-last-updated');
            timestampElements.forEach(element => {
                const anyFallback = Object.values(rates).some(r => r.source === 'fallback');
                const label = anyFallback ? 'Dernier taux connu' : 'Mis à jour';
                element.textContent = `${label}: ${new Date().toLocaleTimeString('fr-FR')}`;
            });

        } catch (error) {
            console.error('Error updating rates in UI:', error);
        }
    }

    // Update portfolio values based on current rates
    updatePortfolioValues(rates) {
        const portfolioElements = document.querySelectorAll('[data-portfolio-crypto]');
        portfolioElements.forEach(element => {
            const crypto = element.dataset.portfolioCrypto;
            const balance = parseFloat(element.dataset.balance || 0);
            const rate = rates[crypto];
            
            if (rate && balance) {
                const value = balance * rate.price;
                element.textContent = this.formatCurrency(value);
            }
        });
    }

    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Fallback rates for offline mode
    getFallbackRates() {
        return {
            BTC: { price: 43000, change_24h: 2.5, last_updated: new Date().toISOString() },
            ETH: { price: 2800, change_24h: -1.2, last_updated: new Date().toISOString() },
            USDT: { price: 1.0, change_24h: 0.0, last_updated: new Date().toISOString() },
            USDC: { price: 1.0, change_24h: 0.0, last_updated: new Date().toISOString() }
        };
    }

    // Formatting helpers
    formatPrice(price) {
        if (price >= 1000) {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        } else {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            }).format(price);
        }
    }

    formatChange(change) {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)}%`;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    formatCrypto(amount, symbol) {
        const decimals = ['BTC', 'ETH'].includes(symbol) ? 8 : 2;
        return `${amount.toFixed(decimals)} ${symbol}`;
    }

    // Start auto-refresh
    startAutoRefresh(interval = 60000) { // 1 minute default
        this.stopAutoRefresh(); // Clear any existing interval
        
        this.refreshInterval = setInterval(() => {
            this.updateRatesInUI();
        }, interval);
        
        // Initial update
        this.updateRatesInUI();
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Global instance
window.cryptoAPI = new CryptoAPI();

// Auto-start refresh when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start auto-refresh on pages with crypto data
    const hasCryptoData = document.querySelector('[data-crypto], [data-portfolio-crypto]');
    if (hasCryptoData) {
        window.cryptoAPI.startAutoRefresh();
    }
});

// Stop refresh when page is hidden (performance optimization)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        window.cryptoAPI.stopAutoRefresh();
    } else {
        const hasCryptoData = document.querySelector('[data-crypto], [data-portfolio-crypto]');
        if (hasCryptoData) {
            window.cryptoAPI.startAutoRefresh();
        }
    }
});
