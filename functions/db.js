// Netlify Function for CryptoBoost Database
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { collection, id, email, user_id } = event.queryStringParameters || {};
        const method = event.httpMethod;
        
        // Enhanced mock database with persistent storage simulation
        const mockDatabase = {
            users: [
                {
                    id: 'admin-default',
                    email: 'admin@cryptoboost.com',
                    password: 'admin123',
                    role: 'admin',
                    full_name: 'Admin Default',
                    phone: '+33123456789',
                    status: 'active',
                    created_at: '2024-01-01T00:00:00Z',
                    last_login: new Date().toISOString()
                },
                {
                    id: 'client-demo',
                    email: 'client@cryptoboost.com',
                    password: 'client123',
                    role: 'client',
                    full_name: 'Client Demo',
                    phone: '+33987654321',
                    status: 'active',
                    created_at: '2024-01-15T10:00:00Z',
                    last_login: new Date().toISOString()
                },
                {
                    id: 'user-1',
                    email: 'john.doe@email.com',
                    password: 'password123',
                    role: 'client',
                    full_name: 'John Doe',
                    phone: '+33111222333',
                    status: 'active',
                    created_at: '2024-01-20T14:30:00Z'
                },
                {
                    id: 'user-2',
                    email: 'jane.smith@email.com',
                    password: 'password456',
                    role: 'client',
                    full_name: 'Jane Smith',
                    phone: '+33444555666',
                    status: 'active',
                    created_at: '2024-02-01T09:15:00Z'
                }
            ],
            transactions: [
                {
                    id: 'tx-001',
                    user_id: 'client-demo',
                    type: 'deposit',
                    crypto: 'BTC',
                    amount: 0.05,
                    usd_value: 2250,
                    status: 'completed',
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    hash: '1a2b3c4d5e6f7g8h9i0j'
                },
                {
                    id: 'tx-002',
                    user_id: 'user-1',
                    type: 'withdraw',
                    crypto: 'ETH',
                    amount: 1.5,
                    usd_value: 4500,
                    status: 'pending',
                    created_at: new Date(Date.now() - 7200000).toISOString()
                },
                {
                    id: 'tx-003',
                    user_id: 'client-demo',
                    type: 'exchange',
                    crypto: 'BTC-ETH',
                    amount: 0.02,
                    usd_value: 900,
                    status: 'completed',
                    created_at: new Date(Date.now() - 10800000).toISOString()
                }
            ],
            wallets: [
                {
                    id: 'wallet-1',
                    user_id: 'client-demo',
                    crypto: 'BTC',
                    balance: 0.12345678,
                    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'wallet-2',
                    user_id: 'client-demo',
                    crypto: 'ETH',
                    balance: 2.5,
                    address: '0x742d35Cc6634C0532925a3b8D4C0d886E',
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'wallet-3',
                    user_id: 'client-demo',
                    crypto: 'USDT',
                    balance: 1000.50,
                    address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5oREqjK',
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'wallet-4',
                    user_id: 'client-demo',
                    crypto: 'USDC',
                    balance: 500.25,
                    address: '0x8ba1f109551bD432803012645Hac136c',
                    updated_at: new Date().toISOString()
                }
            ],
            investments: [
                {
                    id: 'inv-001',
                    user_id: 'client-demo',
                    plan: 'Premium',
                    amount: 5000,
                    crypto: 'USDT',
                    expected_return: 18,
                    status: 'active',
                    start_date: '2024-01-15T00:00:00Z',
                    end_date: '2024-02-15T00:00:00Z',
                    current_value: 5450,
                    created_at: '2024-01-15T10:00:00Z'
                }
            ],
            plans: [
                {
                    id: 'plan-beginner',
                    name: 'Débutant',
                    roi_min: 5,
                    roi_max: 8,
                    min_eur: 50,
                    max_eur: 5000,
                    duration_days: 30,
                    status: 'active',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'plan-standard',
                    name: 'Standard',
                    roi_min: 8,
                    roi_max: 12,
                    min_eur: 500,
                    max_eur: 25000,
                    duration_days: 60,
                    status: 'active',
                    created_at: new Date().toISOString()
                }
            ],
            notifications: [
                {
                    id: 'notif-001',
                    user_id: 'client-demo',
                    title: 'Dépôt confirmé',
                    message: 'Votre dépôt de 0.05 BTC a été confirmé avec succès.',
                    type: 'success',
                    read: false,
                    created_at: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: 'notif-002',
                    user_id: 'client-demo',
                    title: 'Nouveau plan disponible',
                    message: 'Découvrez notre nouveau plan VIP avec 25% de rendement.',
                    type: 'info',
                    read: false,
                    created_at: new Date(Date.now() - 86400000).toISOString()
                }
            ],
            support_tickets: [
                {
                    id: 'ticket-001',
                    user_id: 'client-demo',
                    subject: 'technical',
                    title: 'Problème de connexion',
                    message: 'Je n\'arrive pas à me connecter à mon compte.',
                    status: 'open',
                    priority: 'medium',
                    created_at: new Date(Date.now() - 7200000).toISOString(),
                    updated_at: new Date(Date.now() - 7200000).toISOString()
                }
            ],
            crypto_rates: {
                BTC: { price: 45000, change_24h: 2.5 },
                ETH: { price: 3000, change_24h: -1.2 },
                USDT: { price: 1, change_24h: 0.0 },
                USDC: { price: 1, change_24h: 0.0 }
            }
        };

        let data = mockDatabase[collection] || [];
        
        switch (method) {
            case 'GET':
                // Filter by user_id if provided
                if (user_id) {
                    data = data.filter(item => item.user_id === user_id);
                }
                // Filter by email if provided
                if (email) {
                    data = data.filter(item => item.email === email);
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
                
                // Add to mock database
                if (!mockDatabase[collection]) {
                    mockDatabase[collection] = [];
                }
                mockDatabase[collection].push(newItem);
                
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
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message, stack: error.stack })
        };
    }
};
