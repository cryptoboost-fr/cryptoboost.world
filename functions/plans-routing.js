// Plans API Routing Configuration
const express = require('express');
const router = express.Router();
const { getCachedData, updateCache, CACHE_KEYS } = require('./local-cache');

// Plans configuration
const DEFAULT_PLANS = {
    "beginner": {
        id: "beginner",
        name: "Débutant",
        returns: "5-8%",
        features: ["Trading automatique", "Support 24/7", "Rapports mensuels"],
        minInvestment: 100,
        status: "active"
    },
    "standard": {
        id: "standard",
        name: "Standard",
        returns: "8-12%",
        features: ["IA avancée", "Multi-crypto", "Analytics détaillés"],
        minInvestment: 1000,
        status: "active"
    },
    "premium": {
        id: "premium",
        name: "Premium",
        returns: "12-18%",
        features: ["Stratégies premium", "Gestionnaire dédié", "Accès prioritaire"],
        minInvestment: 5000,
        status: "active"
    },
    "vip": {
        id: "vip",
        name: "VIP",
        returns: "18-25%",
        features: ["Algorithmes exclusifs", "Support VIP", "Formations privées"],
        minInvestment: 25000,
        status: "active"
    }
};

// GET /api/plans
router.get('/', async (req, res) => {
    try {
        const cachedPlans = await getCachedData(CACHE_KEYS.PLANS);
        if (cachedPlans) {
            return res.json(cachedPlans);
        }
        
        await updateCache(CACHE_KEYS.PLANS, DEFAULT_PLANS);
        res.json(DEFAULT_PLANS);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/plans/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cachedPlans = await getCachedData(CACHE_KEYS.PLANS) || DEFAULT_PLANS;
        const plan = cachedPlans[id];
        
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        
        res.json(plan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
