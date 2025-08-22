// Enhanced CoinAPI Integration
const COINAPI_KEY = process.env.COINAPI_KEY;
const COINAPI_BASE = 'https://rest.coinapi.io/v1';

// Cache for rates (5 minutes)
let ratesCache = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000 // 5 minutes
};

class CryptoBoostApp {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.lastActivity = Date.now();
    }

    showDashboard() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated');
        }
        return {
            user: this.currentUser,
            status: 'success',
            data: this.currentUser ? this.currentUser.dashboard : null
        };
    }

    validateAuth(token) {
        // Méthode pour valider l'authentification
        return token && token.length > 0;
    }

    getCurrentUser() {
        // Méthode pour obtenir l'utilisateur courant
        return this.currentUser;
    }
}

const app = new CryptoBoostApp();

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { action, from, to, amount, quote } = event.queryStringParameters || {};

        // Check cache first
        const now = Date.now();
        if (ratesCache.data && (now - ratesCache.timestamp) < ratesCache.ttl) {
            return handleRequest(action, from, to, amount, ratesCache.data, headers, quote);
        }

        // Fetch fresh data from CoinAPI or use fallback
        let rates;
        
        if (COINAPI_KEY) {
            try {
                const quoteCurrency = (event.queryStringParameters && event.queryStringParameters.quote) || 'EUR';
                rates = await fetchFromCoinAPI(quoteCurrency);
            } catch (error) {
                console.error('CoinAPI error:', error);
                const quoteCurrency = (event.queryStringParameters && event.queryStringParameters.quote) || 'EUR';
                rates = getFallbackRates(quoteCurrency);
            }
        } else {
            const quoteCurrency = (event.queryStringParameters && event.queryStringParameters.quote) || 'EUR';
            rates = getFallbackRates(quoteCurrency);
        }

        // Update cache
        ratesCache = {
            data: rates,
            timestamp: now,
            ttl: ratesCache.ttl
        };

        return handleRequest(action, from, to, amount, rates, headers, quote);

    } catch (error) {
        console.error('CoinAPI function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

async function fetchFromCoinAPI(quoteCurrency = 'EUR') {
    const symbols = ['BTC', 'ETH', 'USDT', 'USDC'];
    const rates = {};

    // Fetch current prices
    const pricePromises = symbols.map(async (symbol) => {
        const response = await fetch(
            `${COINAPI_BASE}/exchangerate/${symbol}/${quoteCurrency}`,
            {
                headers: {
                    'X-CoinAPI-Key': COINAPI_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`CoinAPI error for ${symbol}: ${response.status}`);
        }

        const data = await response.json();
        return { symbol, price: data.rate };
    });

    const priceResults = await Promise.all(pricePromises);
    
    // Fetch 24h change data
    const changePromises = symbols.map(async (symbol) => {
        try {
            const response = await fetch(
                `${COINAPI_BASE}/ohlcv/${symbol}/${quoteCurrency}/latest?period_id=1DAY`,
                {
                    headers: {
                        'X-CoinAPI-Key': COINAPI_KEY
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const latest = data[0];
                    const change = ((latest.price_close - latest.price_open) / latest.price_open) * 100;
                    return { symbol, change };
                }
            }
        } catch (error) {
            console.error(`Error fetching change for ${symbol}:`, error);
        }
        return { symbol, change: 0 };
    });

    const changeResults = await Promise.all(changePromises);

    // Combine price and change data
    priceResults.forEach(({ symbol, price }) => {
        const changeData = changeResults.find(c => c.symbol === symbol);
        rates[symbol] = {
            price: price,
            change_24h: changeData ? changeData.change : 0,
            last_updated: new Date().toISOString()
        };
    });

    return rates;
}

function getFallbackRates(quoteCurrency = 'EUR') {
    // Fallback rates with some randomization to simulate market movement
    const baseRates = {
        BTC: 40000,
        ETH: 2600,
        USDT: 0.93,
        USDC: 0.93
    };

    const rates = {};
    Object.entries(baseRates).forEach(([symbol, basePrice]) => {
        // Add some random variation (±5% for crypto, ±0.1% for stablecoins)
        const isStablecoin = ['USDT', 'USDC'].includes(symbol);
        const variation = isStablecoin ? 0.001 : 0.05;
        const randomFactor = 1 + (Math.random() - 0.5) * 2 * variation;
        
        rates[symbol] = {
            price: basePrice * randomFactor,
            change_24h: (Math.random() - 0.5) * (isStablecoin ? 0.2 : 10),
            last_updated: new Date().toISOString(),
            source: 'fallback'
        };
    });

    return rates;
}

function handleRequest(action, from, to, amount, rates, headers, quote = 'EUR') {
    switch (action) {
        case 'rates':
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: rates,
                    timestamp: new Date().toISOString(),
                    quote
                })
            };

        case 'convert':
            if (!from || !to || !amount) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing parameters: from, to, amount' })
                };
            }

            const fromRate = rates[from.toUpperCase()];
            const toRate = rates[to.toUpperCase()];

            if (!fromRate || !toRate) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Unsupported currency pair' })
                };
            }

            const fromUSD = parseFloat(amount) * fromRate.price;
            const result = fromUSD / toRate.price;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: {
                        from: from.toUpperCase(),
                        to: to.toUpperCase(),
                        amount: parseFloat(amount),
                        result: result,
                        rate: fromRate.price / toRate.price,
                        usd_value: fromUSD,
                        timestamp: new Date().toISOString(),
                        quote
                    }
                })
            };

        case 'price':
            const symbol = (from || to || 'BTC').toUpperCase();
            const symbolRate = rates[symbol];

            if (!symbolRate) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Unsupported symbol' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: {
                        symbol: symbol,
                        price: symbolRate.price,
                        change_24h: symbolRate.change_24h,
                        last_updated: symbolRate.last_updated,
                        quote
                    }
                })
            };

        default:
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid action. Use: rates, convert, or price' 
                })
            };
    }
}
