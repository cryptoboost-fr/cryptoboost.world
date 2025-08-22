// Enhanced Plans API for CryptoBoost
const { getCachedData, updateCache, CACHE_KEYS } = require('./local-cache');

// Default plans configuration
const DEFAULT_PLANS = {
    "beginner": {
        id: "beginner",
        name: "Débutant",
        returns: "5-8%",
        features: [
            "Trading automatique",
            "Support 24/7",
            "Rapports mensuels"
        ],
        minInvestment: 100,
        status: "active"
    },
    "standard": {
        id: "standard",
        name: "Standard",
        returns: "8-12%",
        features: [
            "IA avancée",
            "Multi-crypto",
            "Analytics détaillés"
        ],
        minInvestment: 1000,
        status: "active"
    },
    "premium": {
        id: "premium",
        name: "Premium",
        returns: "12-18%",
        features: [
            "Stratégies premium",
            "Gestionnaire dédié",
            "Accès prioritaire"
        ],
        minInvestment: 5000,
        status: "active"
    },
    "vip": {
        id: "vip",
        name: "VIP",
        returns: "18-25%",
        features: [
            "Algorithmes exclusifs",
            "Support VIP",
            "Formations privées"
        ],
        minInvestment: 25000,
        status: "active"
    }
};

// Error handling utility
class APIError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'APIError';
    }
}

// Validation utility
const validatePlan = (plan) => {
    const requiredFields = ['id', 'name', 'returns', 'features', 'minInvestment'];
    for (const field of requiredFields) {
        if (!plan[field]) {
            throw new APIError(`Missing required field: ${field}`, 400);
        }
    }
    return true;
};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    try {
        // Get plan ID from path parameter if present
        const pathParts = event.path.split('/');
        const planId = pathParts[pathParts.length - 1];

        switch (event.httpMethod) {
            case 'GET':
                // Check cache first
                const cachedPlans = await getCachedData(CACHE_KEYS.PLANS);
                if (cachedPlans) {
                    // If specific plan requested
                    if (planId && planId !== 'plans') {
                        const plan = cachedPlans[planId];
                        if (!plan) {
                            throw new APIError('Plan not found', 404);
                        }
                        return {
                            statusCode: 200,
                            headers,
                            body: JSON.stringify(plan)
                        };
                    }
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(cachedPlans)
                    };
                }

                // If no cache, use default plans
                await updateCache(CACHE_KEYS.PLANS, DEFAULT_PLANS);
                
                // Return specific plan or all plans
                if (planId && planId !== 'plans') {
                    const plan = DEFAULT_PLANS[planId];
                    if (!plan) {
                        throw new APIError('Plan not found', 404);
                    }
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(plan)
                    };
                }
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(DEFAULT_PLANS)
                };

            default:
                throw new APIError('Method not allowed', 405);
        }
    } catch (error) {
        console.error('Plans API Error:', error);
        
        const statusCode = error instanceof APIError ? error.statusCode : 500;
        const message = error instanceof APIError ? error.message : 'Internal server error';
        
        return {
            statusCode,
            headers,
            body: JSON.stringify({
                error: message,
                timestamp: new Date().toISOString(),
                path: event.path,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            })
        };
    }
};
