// GitHub Database Integration for CryptoBoost - Enhanced Version
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'cryptoboost-fr';
const GITHUB_REPO = process.env.GITHUB_REPO || 'cryptoboost.world';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_API_BASE = 'https://api.github.com';

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
        const allowedCollections = ['users', 'transactions', 'investments', 'wallets', 'settings'];
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

        // Get file from GitHub
        async function getFileFromGitHub(path) {
            try {
                const response = await fetch(
                    `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
                    { headers: githubHeaders }
                );
                
                if (response.status === 404) {
                    return { content: '[]', sha: null };
                }
                
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                
                const data = await response.json();
                const content = Buffer.from(data.content, 'base64').toString('utf8');
                return { content, sha: data.sha };
            } catch (error) {
                console.error('Error fetching from GitHub:', error);
                return { content: '[]', sha: null };
            }
        }

        // Save file to GitHub
        async function saveFileToGitHub(path, content, sha, message) {
            const body = {
                message,
                content: Buffer.from(content).toString('base64'),
                ...(sha && { sha })
            };

            const response = await fetch(
                `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: { ...githubHeaders, 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to save to GitHub: ${response.status}`);
            }

            return await response.json();
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
                newItem.id = newItem.id || `${collection}-${Date.now()}`;
                newItem.created_at = new Date().toISOString();
                
                data.push(newItem);
                
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
