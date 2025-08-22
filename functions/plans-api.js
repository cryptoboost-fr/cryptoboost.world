// Plans API with simplified error handling
const { getCachedData, updateCache, CACHE_KEYS } = require('./local-cache');

// Default plans configuration
const DEFAULT_PLANS = {
    "beginner": {
        id: "beginner",
        name: "Débutant",
        returns: "5-8%",
        features: ["Trading automatique", "Support 24/7", "Rapports mensuels"],
        minInvestment: 100
    },
    "standard": {
        id: "standard",
        name: "Standard",
        returns: "8-12%",
        features: ["IA avancée", "Multi-crypto", "Analytics détaillés"],
        minInvestment: 1000
    },
    "premium": {
        id: "premium",
        name: "Premium",
        returns: "12-18%",
        features: ["Stratégies premium", "Gestionnaire dédié", "Accès prioritaire"],
        minInvestment: 5000
    },
    "vip": {
        id: "vip",
        name: "VIP",
        returns: "18-25%",
        features: ["Algorithmes exclusifs", "Support VIP", "Formations privées"],
        minInvestment: 25000
    }
};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            // Get the plan ID from the path
            const planId = event.path.split('/').pop();
            
            // Get cached plans or use defaults
            const plans = await getCachedData(CACHE_KEYS.PLANS) || DEFAULT_PLANS;
            
            // If a specific plan is requested
            if (planId && planId !== 'plans') {
                const plan = plans[planId];
                if (!plan) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Plan not found' })
                    };
                }
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(plan)
                };
            }
            
            // Return all plans
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(plans)
            };
        }

        // Handle unsupported methods
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Plans API Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};
