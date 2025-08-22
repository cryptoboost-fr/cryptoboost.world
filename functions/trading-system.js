// Advanced Trading System for CryptoBoost
class TradingSystem {
    constructor() {
        this.orders = new Map();
        this.stopLossOrders = new Map();
        this.limitOrders = new Map();
        this.orderHistory = new Map();
        
        this.init();
    }

    async init() {
        await this.loadActiveOrders();
        this.startPriceMonitoring();
    }

    async createLimitOrder(params) {
        const {
            userId,
            fromCurrency,
            toCurrency,
            amount,
            limitPrice,
            expiry = Date.now() + (24 * 60 * 60 * 1000) // 24h par défaut
        } = params;

        const orderId = `LMT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const order = {
            id: orderId,
            userId,
            type: 'LIMIT',
            fromCurrency,
            toCurrency,
            amount,
            limitPrice,
            status: 'ACTIVE',
            createdAt: Date.now(),
            expiry,
            fills: []
        };

        this.limitOrders.set(orderId, order);
        await this.saveToDB(order);
        
        return order;
    }

    async createStopLossOrder(params) {
        const {
            userId,
            fromCurrency,
            toCurrency,
            amount,
            stopPrice,
            expiry = Date.now() + (24 * 60 * 60 * 1000)
        } = params;

        const orderId = `STP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const order = {
            id: orderId,
            userId,
            type: 'STOP_LOSS',
            fromCurrency,
            toCurrency,
            amount,
            stopPrice,
            status: 'ACTIVE',
            createdAt: Date.now(),
            expiry,
            fills: []
        };

        this.stopLossOrders.set(orderId, order);
        await this.saveToDB(order);
        
        return order;
    }

    async checkLimitOrders(currentPrices) {
        for (const [orderId, order] of this.limitOrders) {
            if (order.status !== 'ACTIVE') continue;
            
            const currentPrice = currentPrices[`${order.fromCurrency}${order.toCurrency}`];
            
            if (!currentPrice) continue;

            if (order.type === 'BUY' && currentPrice <= order.limitPrice) {
                await this.executeLimitOrder(order, currentPrice);
            } else if (order.type === 'SELL' && currentPrice >= order.limitPrice) {
                await this.executeLimitOrder(order, currentPrice);
            }
        }
    }

    async checkStopLossOrders(currentPrices) {
        for (const [orderId, order] of this.stopLossOrders) {
            if (order.status !== 'ACTIVE') continue;
            
            const currentPrice = currentPrices[`${order.fromCurrency}${order.toCurrency}`];
            
            if (!currentPrice) continue;

            if (currentPrice <= order.stopPrice) {
                await this.executeStopLossOrder(order, currentPrice);
            }
        }
    }

    async executeLimitOrder(order, executionPrice) {
        try {
            const result = await this.executeOrder({
                userId: order.userId,
                fromCurrency: order.fromCurrency,
                toCurrency: order.toCurrency,
                amount: order.amount,
                price: executionPrice
            });

            if (result.success) {
                order.status = 'FILLED';
                order.fills.push({
                    price: executionPrice,
                    amount: order.amount,
                    timestamp: Date.now()
                });

                await this.updateOrderInDB(order);
                await this.notifyUser(order.userId, 'LIMIT_ORDER_FILLED', order);
            }
        } catch (error) {
            console.error('Limit order execution error:', error);
            order.status = 'ERROR';
            order.error = error.message;
            await this.updateOrderInDB(order);
            await this.notifyUser(order.userId, 'LIMIT_ORDER_ERROR', order);
        }
    }

    async executeStopLossOrder(order, executionPrice) {
        try {
            const result = await this.executeOrder({
                userId: order.userId,
                fromCurrency: order.fromCurrency,
                toCurrency: order.toCurrency,
                amount: order.amount,
                price: executionPrice
            });

            if (result.success) {
                order.status = 'FILLED';
                order.fills.push({
                    price: executionPrice,
                    amount: order.amount,
                    timestamp: Date.now()
                });

                await this.updateOrderInDB(order);
                await this.notifyUser(order.userId, 'STOP_LOSS_TRIGGERED', order);
            }
        } catch (error) {
            console.error('Stop loss execution error:', error);
            order.status = 'ERROR';
            order.error = error.message;
            await this.updateOrderInDB(order);
            await this.notifyUser(order.userId, 'STOP_LOSS_ERROR', order);
        }
    }

    startPriceMonitoring() {
        setInterval(async () => {
            try {
                const currentPrices = await this.getCurrentPrices();
                await this.checkLimitOrders(currentPrices);
                await this.checkStopLossOrders(currentPrices);
            } catch (error) {
                console.error('Price monitoring error:', error);
            }
        }, 10000); // Vérification toutes les 10 secondes
    }

    async getOrderHistory(userId, params = {}) {
        const {
            startDate,
            endDate,
            type,
            status,
            limit = 50,
            offset = 0
        } = params;

        try {
            const query = {
                userId,
                ...(startDate && { createdAt: { $gte: startDate } }),
                ...(endDate && { createdAt: { $lte: endDate } }),
                ...(type && { type }),
                ...(status && { status })
            };

            const orders = await this.queryOrdersFromDB(query, limit, offset);
            return orders;
        } catch (error) {
            console.error('Order history fetch error:', error);
            throw error;
        }
    }

    async cancelOrder(orderId, userId) {
        const order = this.limitOrders.get(orderId) || this.stopLossOrders.get(orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }

        if (order.userId !== userId) {
            throw new Error('Unauthorized');
        }

        if (order.status !== 'ACTIVE') {
            throw new Error('Order cannot be cancelled');
        }

        order.status = 'CANCELLED';
        await this.updateOrderInDB(order);
        await this.notifyUser(userId, 'ORDER_CANCELLED', order);

        if (order.type === 'LIMIT') {
            this.limitOrders.delete(orderId);
        } else {
            this.stopLossOrders.delete(orderId);
        }

        return { success: true, order };
    }

    async updateOrderInDB(order) {
        // Implémentation de la mise à jour en base de données
        await fetch('/api/orders/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
    }

    async notifyUser(userId, type, data) {
        await fetch('/api/notifications/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                type,
                data
            })
        });
    }
}

// Create global instance
window.tradingSystem = new TradingSystem();

// Export for module usage
export default TradingSystem;
