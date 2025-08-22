// CryptoBoost Vanilla JS Application
class CryptoBoostApp {
    constructor() {
        // Données de base
        this.currentUser = null;
        this.cryptoRates = {};
        this.transactions = [];
        this.charts = {};
        
        // Configuration des frais
        this.settings = {
            exchange_fee_pct: 0.2,
            fees: { 
                BTC: 0.0002, 
                ETH: 0.003, 
                USDT: 2, 
                USDC: 2 
            }
        };
        
        // État de l'application
        this.appState = {
            isLoading: false,
            lastError: null,
            notifications: [],
            connectionStatus: 'online'
        };

        this.init();
    }

    async init() {
        try {
            console.log('Initialisation de CryptoBoost...');
            
            // Configuration de base
            await this.setupUI();
            await this.setupEventListeners();
            await this.loadInitialData();
            
            // Démarrage des mises à jour périodiques
            this.startPeriodicUpdates();
            
            console.log('Initialisation terminée');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.showNotification('Erreur lors du chargement de l\'application', 'error');
        }
    }

    async setupUI() {
        // Configuration des éléments d'interface
        this.setupForms();
        this.setupCharts();
        this.setupNavigation();
        this.initializeCalculator();
    }

    setupForms() {
        // Formulaire d'échange
        const exchangeForm = document.getElementById('exchange-form');
        if (exchangeForm) {
            exchangeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (this.validateForm('exchange-form')) {
                    const formData = new FormData(exchangeForm);
                    await this.handleExchange({
                        fromCurrency: formData.get('from'),
                        toCurrency: formData.get('to'),
                        amount: parseFloat(formData.get('amount'))
                    });
                }
            });
        }

        // Formulaire de contact
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (this.validateForm('contact-form')) {
                    await this.handleContactSubmission(new FormData(contactForm));
                }
            });
        }
    }

    setupCharts() {
        // Graphique des prix
        const priceChart = document.getElementById('price-chart');
        if (priceChart) {
            this.initializePriceChart();
        }

        // Graphique du portfolio
        const portfolioChart = document.getElementById('portfolio-chart');
        if (portfolioChart) {
            this.initializePortfolioChart();
        }
    }

    initializePriceChart() {
        const ctx = document.getElementById('price-chart').getContext('2d');
        this.charts.price = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Prix BTC/EUR',
                    data: [],
                    borderColor: '#F7931A',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    initializePortfolioChart() {
        const ctx = document.getElementById('portfolio-chart').getContext('2d');
        this.charts.portfolio = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['BTC', 'ETH', 'USDT', 'USDC'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#F7931A', '#627EEA', '#26A17B', '#2775CA']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    async handleExchange(data) {
        try {
            this.appState.isLoading = true;
            this.showNotification('Traitement de l\'échange...', 'info');

            // Validation des montants
            if (!this.validateExchange(data)) {
                throw new Error('Montant invalide pour l\'échange');
            }

            // Calcul des frais
            const fees = this.calculateFees(data.amount, data.fromCurrency);
            const totalAmount = data.amount + fees;

            // Vérification du solde
            if (!this.checkBalance(data.fromCurrency, totalAmount)) {
                throw new Error('Solde insuffisant');
            }

            // Exécution de l'échange
            const result = await this.executeExchange(data);
            
            // Mise à jour des soldes
            await this.updateBalances(data, result);

            this.showNotification('Échange réussi !', 'success');
            return result;

        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        } finally {
            this.appState.isLoading = false;
        }
    }

    validateExchange(data) {
        return (
            data.amount > 0 &&
            this.settings.fees[data.fromCurrency] !== undefined &&
            this.settings.fees[data.toCurrency] !== undefined
        );
    }

    calculateFees(amount, currency) {
        return amount * (this.settings.exchange_fee_pct / 100) + this.settings.fees[currency];
    }

    checkBalance(currency, amount) {
        return this.wallets[currency] >= amount;
    }

    async executeExchange(data) {
        // Simulation d'un appel API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    txId: 'TX_' + Date.now(),
                    timestamp: new Date().toISOString()
                });
            }, 1000);
        });
    }

    async updateBalances(data, result) {
        if (result.success) {
            this.wallets[data.fromCurrency] -= (data.amount + this.calculateFees(data.amount, data.fromCurrency));
            const convertedAmount = await this.convertCrypto(data.amount, data.fromCurrency, data.toCurrency);
            this.wallets[data.toCurrency] += convertedAmount;

            // Mise à jour de l'interface
            this.updateWalletDisplays();
            this.updatePortfolioChart();
        }
    }

    updateWalletDisplays() {
        Object.entries(this.wallets).forEach(([currency, amount]) => {
            const element = document.querySelector(`[data-wallet="${currency}"]`);
            if (element) {
                element.textContent = this.formatCryptoAmount(currency, amount);
            }
        });
    }

    async convertCrypto(amount, fromCurrency, toCurrency) {
        if (!this.cryptoRates[fromCurrency] || !this.cryptoRates[toCurrency]) {
            throw new Error('Taux de change non disponible');
        }
        const eurAmount = amount * this.cryptoRates[fromCurrency];
        return eurAmount / this.cryptoRates[toCurrency];
    }

    formatCryptoAmount(currency, amount) {
        const decimals = currency === 'BTC' ? 8 : 6;
        return amount.toFixed(decimals);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;

        const container = document.querySelector('.notifications-container') 
            || document.createElement('div');
        
        if (!container.classList.contains('notifications-container')) {
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 5000);
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CryptoBoostApp();
});
