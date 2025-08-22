// Enhanced GitHub Database Integration for CryptoBoost
// This version includes robust error handling, timeouts, fallbacks, and retry logic

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'cryptoboost-fr';
const GITHUB_REPO = process.env.GITHUB_REPO || 'cryptoboost.world';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_API_BASE = 'https://api.github.com';

// Retry configuration
const RETRY_CONFIG = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 5000,  // 5 seconds
    factor: 2        // Exponential backoff factor
};

// Retry helper function
async function withRetry(operation, options = {}) {
    const config = { ...RETRY_CONFIG, ...options };
    let lastError;
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (attempt === config.maxAttempts) break;
            
            // Calculate delay with exponential backoff
            const delay = Math.min(
                config.baseDelay * Math.pow(config.factor, attempt - 1),
                config.maxDelay
            );
            
            log(`Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms`, 'warn');
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

// Enhanced logging
const log = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] GitHub-DB-Enhanced: ${message}`);
};

// Default data fallbacks
const DEFAULT_DATA = {
    users: [],
    transactions: [],
    investments: [],
    wallets: [],
    settings: {
        maintenance: false,
        fees: { deposit: 0, withdrawal: 0, exchange: 0.001 },
        masterWallets: { BTC: '', ETH: '', USDT: '', USDC: '' }
    }
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

    // Comprehensive validation
    if (!GITHUB_TOKEN) {
        log('GitHub token not configured', 'error');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Configuration Error',
                message: 'GitHub token not configured. Please check environment variables.',
                code: 'MISSING_TOKEN'
            })
        };
    }

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
        const allowedCollections = Object.keys(DEFAULT_DATA);
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

        // Enhanced GitHub API headers
        const githubHeaders = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CryptoBoost-App',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        // Enhanced file operations with timeout and retry
        async function getFileFromGitHub(path, retries = 3) {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    log(`Attempting to get file ${path} (attempt ${attempt}/${retries})`);

                    // Create AbortController for timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                    const response = await fetch(
                        `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
                        {
                            headers: githubHeaders,
                            signal: controller.signal
                        }
                    );

                    clearTimeout(timeoutId);

                    if (response.status === 404) {
                        log(`File ${path} not found, returning default data`);
                        const collectionName = path.replace('.json', '');
                        return {
                            data: DEFAULT_DATA[collectionName] || [],
                            sha: null
                        };
                    }

                    if (response.status === 403) {
                        log(`GitHub API rate limit or token issue: ${response.statusText}`, 'error');
                        return {
                            error: 'API Rate Limited',
                            message: 'GitHub API rate limit exceeded. Please try again later.',
                            code: 'RATE_LIMIT'
                        };
                    }

                    if (response.status === 401) {
                        log(`GitHub token invalid or expired`, 'error');
                        return {
                            error: 'Authentication Error',
                            message: 'GitHub token is invalid or expired. Please check configuration.',
                            code: 'INVALID_TOKEN'
                        };
                    }

                    if (!response.ok) {
                        const errorText = await response.text().catch(() => 'Unknown error');
                        log(`GitHub API error (${response.status}): ${errorText}`, 'error');
                        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
                    }

                    const fileData = await response.json();

                    if (!fileData.content) {
                        log(`File ${path} has no content`, 'warn');
                        const collectionName = path.replace('.json', '');
                        return {
                            data: DEFAULT_DATA[collectionName] || [],
                            sha: fileData.sha
                        };
                    }

                    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                    let parsedData;

                    try {
                        parsedData = JSON.parse(content);
                    } catch (parseError) {
                        log(`JSON parse error for ${path}: ${parseError.message}`, 'error');
                        const collectionName = path.replace('.json', '');
                        return {
                            data: DEFAULT_DATA[collectionName] || [],
                            error: 'Parse Error',
                            message: 'File content was corrupted, using defaults',
                            code: 'INVALID_JSON'
                        };
                    }

                    log(`Successfully retrieved file ${path}`);
                    return {
                        data: parsedData,
                        sha: fileData.sha
                    };

                } catch (error) {
                    log(`Error getting file ${path} (attempt ${attempt}): ${error.message}`, 'error');

                    if (error.name === 'AbortError') {
                        log(`Request timeout for ${path}`, 'warn');
                    }

                    if (attempt === retries) {
                        const collectionName = path.replace('.json', '');
                        return {
                            data: DEFAULT_DATA[collectionName] || [],
                            error: 'Network Error',
                            message: `Failed to retrieve file after ${retries} attempts, using defaults`,
                            code: 'NETWORK_ERROR',
                            details: error.message
                        };
                    }

                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        // Enhanced file operations with error handling
        async function saveFileToGitHub(path, content, sha = null, retries = 3) {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    log(`Attempting to save file ${path} (attempt ${attempt}/${retries})`);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for writes

                    const body = {
                        message: `Update ${path} via CryptoBoost API`,
                        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
                        branch: GITHUB_BRANCH
                    };

                    if (sha) {
                        body.sha = sha;
                    }

                    const response = await fetch(
                        `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
                        {
                            method: 'PUT',
                            headers: githubHeaders,
                            body: JSON.stringify(body),
                            signal: controller.signal
                        }
                    );

                    clearTimeout(timeoutId);

                    if (response.status === 409) {
                        log(`Conflict saving ${path}, file may have been modified`, 'warn');
                        return {
                            error: 'Conflict',
                            message: 'File was modified by another process. Please retry.',
                            code: 'CONFLICT'
                        };
                    }

                    if (response.status === 403) {
                        log(`Permission denied saving ${path}`, 'error');
                        return {
                            error: 'Permission Denied',
                            message: 'Insufficient permissions to save file',
                            code: 'PERMISSION_DENIED'
                        };
                    }

                    if (!response.ok) {
                        const errorText = await response.text().catch(() => 'Unknown error');
                        log(`GitHub API save error (${response.status}): ${errorText}`, 'error');
                        throw new Error(`Save failed: ${response.status} ${response.statusText}`);
                    }

                    const result = await response.json();
                    log(`Successfully saved file ${path}`);
                    return { success: true, sha: result.content.sha };

                } catch (error) {
                    log(`Error saving file ${path} (attempt ${attempt}): ${error.message}`, 'error');

                    if (attempt === retries) {
                        return {
                            error: 'Save Error',
                            message: `Failed to save file after ${retries} attempts`,
                            code: 'SAVE_ERROR',
                            details: error.message
                        };
                    }

                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        // Main request handling
        const fileName = `${collection}.json`;

        switch (method) {
            case 'GET':
                if (id) {
                    // Get specific item
                    const fileResult = await getFileFromGitHub(fileName);
                    if (fileResult.error) {
                        return {
                            statusCode: 500,
                            headers,
                            body: JSON.stringify(fileResult)
                        };
                    }

                    const item = fileResult.data.find(item => item.id === id);
                    if (!item) {
                        return {
                            statusCode: 404,
                            headers,
                            body: JSON.stringify({
                                error: 'Not Found',
                                message: `Item with id ${id} not found in ${collection}`,
                                code: 'ITEM_NOT_FOUND'
                            })
                        };
                    }

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            data: item,
                            collection,
                            timestamp: new Date().toISOString()
                        })
                    };
                } else {
                    // Get all items
                    const fileResult = await getFileFromGitHub(fileName);
                    if (fileResult.error) {
                        return {
                            statusCode: 500,
                            headers,
                            body: JSON.stringify(fileResult)
                        };
                    }

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            data: fileResult.data,
                            count: fileResult.data.length,
                            collection,
                            timestamp: new Date().toISOString()
                        })
                    };
                }

            case 'POST':
                // Create new item
                const fileResult = await getFileFromGitHub(fileName);
                if (fileResult.error) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(fileResult)
                    };
                }

                let body;
                try {
                    body = JSON.parse(event.body || '{}');
                } catch (parseError) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            error: 'Bad Request',
                            message: 'Invalid JSON in request body',
                            code: 'INVALID_JSON'
                        })
                    };
                }

                // Add metadata
                body.id = body.id || generateId();
                body.createdAt = body.createdAt || new Date().toISOString();
                body.updatedAt = new Date().toISOString();

                // Add to collection
                const newData = [...fileResult.data, body];

                const saveResult = await saveFileToGitHub(fileName, newData, fileResult.sha);
                if (saveResult.error) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(saveResult)
                    };
                }

                return {
                    statusCode: 201,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: body,
                        message: 'Item created successfully',
                        collection
                    })
                };

            case 'PUT':
                if (!id) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            error: 'Bad Request',
                            message: 'ID parameter required for updates',
                            code: 'MISSING_ID'
                        })
                    };
                }

                // Update existing item
                const updateFileResult = await getFileFromGitHub(fileName);
                if (updateFileResult.error) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(updateFileResult)
                    };
                }

                let updateBody;
                try {
                    updateBody = JSON.parse(event.body || '{}');
                } catch (parseError) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            error: 'Bad Request',
                            message: 'Invalid JSON in request body',
                            code: 'INVALID_JSON'
                        })
                    };
                }

                const itemIndex = updateFileResult.data.findIndex(item => item.id === id);
                if (itemIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({
                            error: 'Not Found',
                            message: `Item with id ${id} not found`,
                            code: 'ITEM_NOT_FOUND'
                        })
                    };
                }

                // Update item
                updateFileResult.data[itemIndex] = {
                    ...updateFileResult.data[itemIndex],
                    ...updateBody,
                    updatedAt: new Date().toISOString()
                };

                const updateSaveResult = await saveFileToGitHub(fileName, updateFileResult.data, updateFileResult.sha);
                if (updateSaveResult.error) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(updateSaveResult)
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: updateFileResult.data[itemIndex],
                        message: 'Item updated successfully',
                        collection
                    })
                };

            case 'DELETE':
                if (!id) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            error: 'Bad Request',
                            message: 'ID parameter required for deletion',
                            code: 'MISSING_ID'
                        })
                    };
                }

                // Delete item
                const deleteFileResult = await getFileFromGitHub(fileName);
                if (deleteFileResult.error) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(deleteFileResult)
                    };
                }

                const deleteIndex = deleteFileResult.data.findIndex(item => item.id === id);
                if (deleteIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({
                            error: 'Not Found',
                            message: `Item with id ${id} not found`,
                            code: 'ITEM_NOT_FOUND'
                        })
                    };
                }

                // Remove item
                const deletedItem = deleteFileResult.data.splice(deleteIndex, 1)[0];
                const deleteSaveResult = await saveFileToGitHub(fileName, deleteFileResult.data, deleteFileResult.sha);

                if (deleteSaveResult.error) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(deleteSaveResult)
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: deletedItem,
                        message: 'Item deleted successfully',
                        collection
                    })
                };

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({
                        error: 'Method Not Allowed',
                        message: `Method ${method} not supported`,
                        code: 'METHOD_NOT_ALLOWED',
                        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
                    })
                };
        }

    } catch (error) {
        log(`Unexpected error: ${error.message}`, 'error');
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

// Utility function to generate IDs
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

console.log('🔧 Enhanced GitHub DB Function loaded with robust error handling!');
