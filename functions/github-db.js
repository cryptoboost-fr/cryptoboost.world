// GitHub Storage Integration for CryptoBoost
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'cryptoboost-fr';
const GITHUB_REPO = process.env.GITHUB_REPO || 'cryptoboost.world';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_API_BASE = 'https://api.github.com';

// Import du système de cache local
const { getCachedData, updateCache, invalidateCache, CACHE_KEYS } = require('./local-cache');

// Nombre maximum de requêtes par heure
const MAX_REQUESTS_PER_HOUR = 5000;
let requestCount = 0;
let requestResetTime = Date.now() + 3600000; // +1 heure

// Gestion des requêtes à l'API GitHub
async function makeGitHubRequest(url, options = {}) {
    // Vérifier les limites de l'API
    if (requestCount >= MAX_REQUESTS_PER_HOUR) {
        const waitTime = requestResetTime - Date.now();
        if (waitTime > 0) {
            throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime/60000)} minutes`);
        }
        requestCount = 0;
    }

    requestCount++;
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CryptoBoost-App'
        }
    });

    // Mise à jour des limites
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining) requestCount = MAX_REQUESTS_PER_HOUR - parseInt(remaining);
    if (reset) requestResetTime = parseInt(reset) * 1000;

    return response;
}

// Enhanced error handling and logging
const log = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] GitHub-DB: ${message}`);
};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Enhanced CORS handling
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight success' })
        };
    }

    // Lightweight health endpoint that does not require token
    const { action } = event.queryStringParameters || {};
    if (action === 'health') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: 'ok',
                time: new Date().toISOString(),
                owner: GITHUB_OWNER || null,
                repo: GITHUB_REPO || null,
                branch: GITHUB_BRANCH || null,
                token: GITHUB_TOKEN ? 'configured' : 'missing'
            })
        };
    }

    // Enhanced token validation
    if (!GITHUB_TOKEN) {
        log('GitHub token not configured', 'error');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Configuration Error',
                message: 'GitHub token not configured',
                code: 'MISSING_TOKEN'
            })
        };
    }

    // Enhanced owner/repo validation
    if (!GITHUB_OWNER || !GITHUB_REPO) {
        log('GitHub owner or repo not configured', 'error');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Configuration Error',
                message: 'GitHub owner or repository not configured',
                code: 'MISSING_REPO_CONFIG'
            })
        };
    }

    try {
        const { collection, id, user_id } = event.queryStringParameters || {};
        const method = event.httpMethod;
        const fileName = `${collection}.json`;

        log(`Request: ${method} /${collection}${id ? `/${id}` : ''}`);

        // Enhanced collection validation
        if (!collection) {
            log('Missing collection parameter', 'warn');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Bad Request',
                    message: 'Collection parameter is required',
                    code: 'MISSING_COLLECTION'
                })
            };
        }

        // Validate collection name
        const allowedCollections = [
            'users',
            'transactions',
            'investments',
            'wallets',
            'settings',
            'plans',
            'subscriptions',
            'support_tickets',
            'notifications',
            'crypto_rates',
            'system_logs',
            'audit_trail'
        ];

        // Collection-specific validation rules
        const collectionRules = {
            transactions: {
                required: ['user_id', 'type', 'amount', 'currency'],
                types: ['deposit', 'withdrawal', 'exchange'],
                statuses: ['pending', 'completed', 'failed', 'cancelled']
            },
            wallets: {
                required: ['user_id', 'currency', 'balance'],
                currencies: ['BTC', 'ETH', 'USDT', 'USDC']
            },
            users: {
                required: ['email', 'role'],
                roles: ['admin', 'client']
            }
        };
        if (!allowedCollections.includes(collection)) {
            log(`Invalid collection: ${collection}`, 'warn');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Bad Request',
                    message: `Invalid collection: ${collection}`,
                    code: 'INVALID_COLLECTION',
                    allowedCollections
                })
            };
        }

        // Enhanced GitHub API headers with timeout
        const githubHeaders = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CryptoBoost-App',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        // Get file from GitHub with caching and rate limit handling
        async function getFileFromGitHub(path) {
            try {
                // Add cache-busting parameter for important collections
                const importantCollections = ['transactions', 'wallets', 'crypto_rates'];
                const isImportant = importantCollections.some(col => path.includes(col));
                const cacheBuster = isImportant ? `&t=${Date.now()}` : '';
                
                const response = await fetch(
                    `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}${cacheBuster}`,
                    { 
                        headers: githubHeaders,
                        timeout: 5000 // 5 second timeout
                    }
                );
                
                // Handle rate limiting
                const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
                const rateLimitReset = response.headers.get('x-ratelimit-reset');
                
                if (rateLimitRemaining && parseInt(rateLimitRemaining) < 100) {
                    log(`GitHub API rate limit low: ${rateLimitRemaining} remaining`, 'warn');
                }
                
                if (response.status === 403 && rateLimitReset) {
                    const resetTime = new Date(parseInt(rateLimitReset) * 1000);
                    throw new Error(`Rate limit exceeded. Resets at ${resetTime.toLocaleString()}`);
                }
                
                if (response.status === 404) {
                    log(`File not found: ${path}, creating new`, 'info');
                    return { content: '[]', sha: null };
                }
                
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status} - ${await response.text()}`);
                }
                
                const data = await response.json();
                const content = Buffer.from(data.content, 'base64').toString('utf8');
                
                // Validate JSON content
                try {
                    JSON.parse(content);
                } catch (e) {
                    log(`Invalid JSON in ${path}, resetting to empty array`, 'error');
                    return { content: '[]', sha: data.sha };
                }
                
                return { content, sha: data.sha };
            } catch (error) {
                log(`Error fetching from GitHub: ${error.message}`, 'error');
                if (error.message.includes('Rate limit')) {
                    throw error; // Rethrow rate limit errors
                }
                return { content: '[]', sha: null };
            }
        }

        // Save file to GitHub with retries and conflict resolution
        async function saveFileToGitHub(path, content, sha, message) {
            const maxRetries = 3;
            let retryCount = 0;
            
            while (retryCount < maxRetries) {
                try {
                    // Validate content before saving
                    try {
                        JSON.parse(content);
                    } catch (e) {
                        throw new Error(`Invalid JSON content for ${path}`);
                    }
                    
                    const body = {
                        message: `${message} [${new Date().toISOString()}]`,
                        content: Buffer.from(content).toString('base64'),
                        branch: GITHUB_BRANCH,
                        ...(sha && { sha })
                    };
                    
                    const response = await fetch(
                        `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
                        {
                            method: 'PUT',
                            headers: { ...githubHeaders, 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                            timeout: 8000 // 8 second timeout
                        }
                    );
                    
                    if (response.status === 409) {
                        // Handle conflict by getting latest version and retrying
                        log(`Conflict detected for ${path}, retrying with latest version`, 'warn');
                        const latest = await getFileFromGitHub(path);
                        sha = latest.sha;
                        retryCount++;
                        continue;
                    }
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
                    }
                    
                    const result = await response.json();
                    log(`Successfully saved ${path}`, 'info');
                    return result;
                    
                } catch (error) {
                    if (retryCount >= maxRetries - 1) {
                        throw new Error(`Failed to save to GitHub after ${maxRetries} attempts: ${error.message}`);
                    }
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
                }
            }
        }

        // Get current data
        const { content: fileContent, sha } = await getFileFromGitHub(fileName);
        let data = JSON.parse(fileContent);

        switch (method) {
            case 'GET':
                // Filter by user_id if provided
                if (user_id) {
                    data = data.filter(item => item.user_id === user_id);
                }
                // Get specific item by id
                if (id) {
                    data = data.find(item => item.id === id) || null;
                }
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data)
                };
                
            case 'POST':
                const newItem = JSON.parse(event.body);
                
                // Validate required fields
                if (collectionRules[collection]) {
                    const { required, types, statuses, currencies } = collectionRules[collection];
                    
                    // Check required fields
                    const missingFields = required.filter(field => !newItem[field]);
                    if (missingFields.length > 0) {
                        return {
                            statusCode: 400,
                            headers,
                            body: JSON.stringify({
                                error: 'Validation Error',
                                message: `Missing required fields: ${missingFields.join(', ')}`,
                                code: 'MISSING_FIELDS'
                            })
                        };
                    }
                    
                    // Validate specific fields
                    if (types && newItem.type && !types.includes(newItem.type)) {
                        return {
                            statusCode: 400,
                            headers,
                            body: JSON.stringify({
                                error: 'Validation Error',
                                message: `Invalid type. Must be one of: ${types.join(', ')}`,
                                code: 'INVALID_TYPE'
                            })
                        };
                    }
                    
                    if (statuses && newItem.status && !statuses.includes(newItem.status)) {
                        return {
                            statusCode: 400,
                            headers,
                            body: JSON.stringify({
                                error: 'Validation Error',
                                message: `Invalid status. Must be one of: ${statuses.join(', ')}`,
                                code: 'INVALID_STATUS'
                            })
                        };
                    }
                    
                    if (currencies && newItem.currency && !currencies.includes(newItem.currency)) {
                        return {
                            statusCode: 400,
                            headers,
                            body: JSON.stringify({
                                error: 'Validation Error',
                                message: `Invalid currency. Must be one of: ${currencies.join(', ')}`,
                                code: 'INVALID_CURRENCY'
                            })
                        };
                    }
                }
                
                // Add metadata
                newItem.id = newItem.id || `${collection}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                newItem.created_at = new Date().toISOString();
                newItem.created_by = event.requestContext?.identity?.user || 'system';
                
                // Add to audit trail for sensitive collections
                if (['transactions', 'wallets'].includes(collection)) {
                    const auditEntry = {
                        id: `audit-${Date.now()}`,
                        collection,
                        action: 'create',
                        item_id: newItem.id,
                        timestamp: newItem.created_at,
                        user: newItem.created_by,
                        changes: newItem
                    };
                    
                    const { content: auditContent, sha: auditSha } = await getFileFromGitHub('audit_trail.json');
                    const auditData = JSON.parse(auditContent);
                    auditData.push(auditEntry);
                    
                    await saveFileToGitHub(
                        'audit_trail.json',
                        JSON.stringify(auditData, null, 2),
                        auditSha,
                        `Add audit trail entry for ${collection}`
                    );
                }
                
                data.push(newItem);
                
                try {
                    await saveFileToGitHub(
                        fileName,
                        JSON.stringify(data, null, 2),
                        sha,
                        `Add new ${collection} item: ${newItem.id}`
                    );
                
                return {
                    statusCode: 201,
                    headers,
                    body: JSON.stringify(newItem)
                };
                
            case 'PUT':
                const updateItem = JSON.parse(event.body);
                const index = data.findIndex(item => item.id === updateItem.id);
                
                if (index !== -1) {
                    data[index] = { ...data[index], ...updateItem, updated_at: new Date().toISOString() };
                    
                    await saveFileToGitHub(
                        fileName,
                        JSON.stringify(data, null, 2),
                        sha,
                        `Update ${collection} item: ${updateItem.id}`
                    );
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(data[index])
                    };
                }
                
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Item not found' })
                };
                
            case 'DELETE':
                const deleteIndex = data.findIndex(item => item.id === id);
                
                if (deleteIndex !== -1) {
                    const deletedItem = data.splice(deleteIndex, 1)[0];
                    
                    await saveFileToGitHub(
                        fileName,
                        JSON.stringify(data, null, 2),
                        sha,
                        `Delete ${collection} item: ${id}`
                    );
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(deletedItem)
                    };
                }
                
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Item not found' })
                };
                
            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
