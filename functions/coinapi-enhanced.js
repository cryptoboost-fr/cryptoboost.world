// Enhanced CoinAPI Integration for CryptoBoost
// This version includes robust error handling, fallbacks, and caching

const COINAPI_KEY = process.env.COINAPI_KEY;
const COINAPI_BASE = 'https://rest.coinapi.io/v1';

// Enhanced logging
const log = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] CoinAPI-Enhanced: ${message}`);
};

// Enhanced cache with better structure
let ratesCache = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutes
    lastFetch: null,
    errorCount: 0
};

// Fallback rates in case API fails
const FALLBACK_RATES = {
    'BTC': { 'EUR': 45000, 'USD': 48000 },
    'ETH': { 'EUR': 2800, 'USD': 3000 },
    'USDT': { 'EUR': 0.85, 'USD': 0.90 },
    'USDC': { 'EUR': 0.85, 'USD': 0.90 }
};

// Default cryptocurrencies supported
const SUPPORTED_CRYPTOS = ['BTC', 'ETH', 'USDT', 'USDC'];

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
    };

    // Enhanced CORS handling with preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'CORS preflight success',
                supportedMethods: ['GET', 'OPTIONS'],
                supportedParams: ['action', 'from', 'to', 'amount', 'quote']
            })
        };
    }

    try {
        const { action, from, to, amount, quote } = event.queryStringParameters || {};

        log(`Request: ${action} from=${from} to=${to} quote=${quote}`);

        // Validate action parameter
        if (!action) {
            log('Missing action parameter', 'warn');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Bad Request',
                    message: 'Action parameter is required',
                    code: 'MISSING_ACTION',
                    supportedActions: ['rates', 'exchange', 'symbols']
                })
            };
        }

        // Enhanced token validation with better error message
        if (!COINAPI_KEY) {
            log('CoinAPI key not configured, using fallback rates', 'warn');
            return handleFallbackRates(action, from, to, amount, quote, headers);
        }

        switch (action) {
            case 'rates':
                return await handleRatesRequest(quote || 'EUR', headers);

            case 'exchange':
                return await handleExchangeRequest(from, to, amount, headers);

            case 'symbols':
                return await handleSymbolsRequest(headers);

            default:
                log(`Unknown action: ${action}`, 'warn');
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Bad Request',
                        message: `Unknown action: ${action}`,
                        code: 'UNKNOWN_ACTION',
                        supportedActions: ['rates', 'exchange', 'symbols']
                    })
                };
        }

    } catch (error) {
        log(`Unexpected error: ${error.message}`, 'error');
        ratesCache.errorCount++;

        // If we have too many errors, use fallback
        if (ratesCache.errorCount > 5) {
            log('Too many errors, switching to fallback mode', 'warn');
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    error: 'Service Unavailable',
                    message: 'API temporarily unavailable, using fallback rates',
                    code: 'FALLBACK_MODE',
                    fallback: true
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred',
                code: 'INTERNAL_ERROR',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};

// Enhanced rates request with better caching
async function handleRatesRequest(quote = 'EUR', headers) {
    const now = Date.now();

    // Check cache first
    if (ratesCache.data && (now - ratesCache.timestamp) < ratesCache.ttl) {
        log('Returning cached rates');
        return {
            statusCode: 200,
            headers: { ...headers, 'X-Cache': 'HIT' },
            body: JSON.stringify({
                success: true,
                data: ratesCache.data,
                cached: true,
                timestamp: ratesCache.timestamp,
                quote,
                cacheAge: now - ratesCache.timestamp
            })
        };
    }

    try {
        log(`Fetching fresh rates for ${quote}`);

        // Enhanced API call with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(
            `${COINAPI_BASE}/exchangerate/BTC,ETH,USDT,USDC?filter_asset_id=${quote}`,
            {
                headers: {
                    'X-CoinAPI-Key': COINAPI_KEY,
                    'Accept': 'application/json'
                },
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (response.status === 429) {
            log('CoinAPI rate limit exceeded, using fallback', 'warn');
            return handleFallbackRates('rates', null, null, null, quote, headers);
        }

        if (response.status === 401) {
            log('CoinAPI key invalid, using fallback', 'error');
            return handleFallbackRates('rates', null, null, null, quote, headers);
        }

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            log(`CoinAPI error (${response.status}): ${errorText}`, 'error');
            return handleFallbackRates('rates', null, null, null, quote, headers);
        }

        const data = await response.json();

        if (!data || !data.rates) {
            log('Invalid response format from CoinAPI', 'error');
            return handleFallbackRates('rates', null, null, null, quote, headers);
        }

        // Enhanced data processing
        const processedRates = {};
        data.rates.forEach(rate => {
            if (SUPPORTED_CRYPTOS.includes(rate.asset_id_base)) {
                processedRates[rate.asset_id_base] = {
                    [rate.asset_id_quote]: rate.rate,
                    lastUpdate: rate.time,
                    source: 'CoinAPI'
                };
            }
        });

        // Cache the results
        ratesCache.data = processedRates;
        ratesCache.timestamp = now;
        ratesCache.lastFetch = new Date().toISOString();
        ratesCache.errorCount = 0; // Reset error count on success

        log(`Successfully fetched rates for ${Object.keys(processedRates).length} cryptos`);

        return {
            statusCode: 200,
            headers: { ...headers, 'X-Cache': 'MISS' },
            body: JSON.stringify({
                success: true,
                data: processedRates,
                cached: false,
                timestamp: now,
                quote,
                source: 'CoinAPI',
                lastFetch: ratesCache.lastFetch
            })
        };

    } catch (error) {
        log(`Error fetching rates: ${error.message}`, 'error');
        return handleFallbackRates('rates', null, null, null, quote, headers);
    }
}

// Enhanced exchange request
async function handleExchangeRequest(from, to, amount, headers) {
    if (!from || !to) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                error: 'Bad Request',
                message: 'From and to currencies are required',
                code: 'MISSING_CURRENCIES'
            })
        };
    }

    if (!amount || isNaN(parseFloat(amount))) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                error: 'Bad Request',
                message: 'Valid amount is required',
                code: 'INVALID_AMOUNT'
            })
        };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(
            `${COINAPI_BASE}/exchangerate/${from}/${to}`,
            {
                headers: {
                    'X-CoinAPI-Key': COINAPI_KEY,
                    'Accept': 'application/json'
                },
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            log(`Exchange rate error (${response.status})`, 'error');
            return handleFallbackRates('exchange', from, to, amount, null, headers);
        }

        const data = await response.json();
        const exchangeAmount = parseFloat(amount) * data.rate;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: {
                    from,
                    to,
                    amount: parseFloat(amount),
                    rate: data.rate,
                    result: exchangeAmount,
                    timestamp: data.time
                },
                source: 'CoinAPI'
            })
        };

    } catch (error) {
        log(`Error in exchange: ${error.message}`, 'error');
        return handleFallbackRates('exchange', from, to, amount, null, headers);
    }
}

// Enhanced symbols request
async function handleSymbolsRequest(headers) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
            `${COINAPI_BASE}/symbols`,
            {
                headers: {
                    'X-CoinAPI-Key': COINAPI_KEY,
                    'Accept': 'application/json'
                },
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            log(`Symbols error (${response.status})`, 'error');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: SUPPORTED_CRYPTOS,
                    source: 'fallback',
                    message: 'Using supported cryptocurrencies list'
                })
            };
        }

        const data = await response.json();
        const cryptoSymbols = data.filter(symbol =>
            SUPPORTED_CRYPTOS.includes(symbol.symbol_id) ||
            symbol.symbol_id.includes('EUR') ||
            symbol.symbol_id.includes('USD')
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: cryptoSymbols,
                count: cryptoSymbols.length,
                source: 'CoinAPI'
            })
        };

    } catch (error) {
        log(`Error fetching symbols: ${error.message}`, 'error');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: SUPPORTED_CRYPTOS,
                source: 'fallback',
                message: 'Using supported cryptocurrencies list'
            })
        };
    }
}

// Enhanced fallback rates handler
function handleFallbackRates(action, from, to, amount, quote, headers) {
    log('Using fallback rates', 'info');

    const fallbackData = {
        'BTC': { 'EUR': 45000 + Math.random() * 2000, 'USD': 48000 + Math.random() * 2000 },
        'ETH': { 'EUR': 2800 + Math.random() * 200, 'USD': 3000 + Math.random() * 200 },
        'USDT': { 'EUR': 0.85 + Math.random() * 0.05, 'USD': 0.90 + Math.random() * 0.05 },
        'USDC': { 'EUR': 0.85 + Math.random() * 0.05, 'USD': 0.90 + Math.random() * 0.05 }
    };

    switch (action) {
        case 'rates':
            const ratesQuote = quote || 'EUR';
            const filteredRates = {};

            Object.keys(fallbackData).forEach(crypto => {
                if (fallbackData[crypto][ratesQuote]) {
                    filteredRates[crypto] = {
                        [ratesQuote]: fallbackData[crypto][ratesQuote],
                        lastUpdate: new Date().toISOString(),
                        source: 'fallback'
                    };
                }
            });

            return {
                statusCode: 200,
                headers: { ...headers, 'X-Fallback': 'true' },
                body: JSON.stringify({
                    success: true,
                    data: filteredRates,
                    fallback: true,
                    timestamp: Date.now(),
                    quote: ratesQuote,
                    source: 'fallback',
                    message: 'Using fallback rates due to API unavailability'
                })
            };

        case 'exchange':
            if (!from || !to || !amount) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Bad Request',
                        message: 'Missing required parameters',
                        code: 'MISSING_PARAMS'
                    })
                };
            }

            const rate = fallbackData[from]?.['EUR'] || 1;
            const result = parseFloat(amount) * rate;

            return {
                statusCode: 200,
                headers: { ...headers, 'X-Fallback': 'true' },
                body: JSON.stringify({
                    success: true,
                    data: {
                        from,
                        to,
                        amount: parseFloat(amount),
                        rate,
                        result,
                        timestamp: new Date().toISOString()
                    },
                    fallback: true,
                    source: 'fallback'
                })
            };

        default:
            return {
                statusCode: 200,
                headers: { ...headers, 'X-Fallback': 'true' },
                body: JSON.stringify({
                    success: true,
                    data: fallbackData,
                    fallback: true,
                    source: 'fallback'
                })
            };
    }
}

// Health check endpoint
exports.health = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        apiKey: COINAPI_KEY ? 'configured' : 'missing',
        cache: {
            hasData: !!ratesCache.data,
            age: ratesCache.data ? Date.now() - ratesCache.timestamp : null,
            errorCount: ratesCache.errorCount
        },
        supportedCryptos: SUPPORTED_CRYPTOS,
        fallbackRates: Object.keys(FALLBACK_RATES)
    };

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(health)
    };
};

console.log('🔧 Enhanced CoinAPI Function loaded with fallback system!');
