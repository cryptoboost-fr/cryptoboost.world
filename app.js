// CryptoBoost Application - Version améliorée
class CryptoBoostApp {
    constructor() {
        this.currentUser = null;
        this.cryptoRates = {};
        this.transactions = [];
        this.charts = {};
        this.settings = {
            exchange_fee_pct: 0.2,
            fees: { 
                BTC: 0.0002, 
                ETH: 0.003, 
                USDT: 2, 
                USDC: 2 
            }
        };
        this.appState = {
            isLoading: false,
            lastError: null,
            notifications: [],
            connectionStatus: 'online',
            currentView: null,
            performance: {
                lastUpdate: Date.now(),
                metrics: {}
            }
        };
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
    }

    // Fonctions de navigation et d'affichage
    showLogin() {
        this.appState.currentView = 'login';
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('registerModal').classList.add('hidden');
    }

    showRegister() {
        this.appState.currentView = 'register';
        document.getElementById('registerModal').classList.remove('hidden');
        document.getElementById('loginModal').classList.add('hidden');
    }

    async showDashboard() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }
        this.appState.currentView = 'dashboard';
        await this.loadDashboardData();
        document.getElementById('dashboardView').classList.remove('hidden');
    }

    showDeposit() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }
        this.appState.currentView = 'deposit';
        document.getElementById('depositModal').classList.remove('hidden');
    }

    showWithdraw() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }
        this.appState.currentView = 'withdraw';
        document.getElementById('withdrawModal').classList.remove('hidden');
    }

    showExchange() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }
        this.appState.currentView = 'exchange';
        document.getElementById('exchangeView').classList.remove('hidden');
        this.updateExchangeRates();
    }

    // Fonctions d'authentification
    async validateAuth() {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        
        try {
            const response = await fetch('/.netlify/functions/auth', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                this.logout();
                return false;
            }
            
            const data = await response.json();
            this.currentUser = data.user;
            return true;
        } catch (error) {
            console.error('Auth validation error:', error);
            this.logout();
            return false;
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    protectPage() {
        if (!this.currentUser) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        window.location.href = '/login.html';
    }

    // Fonctions utilitaires
    setupEventListeners() {
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLogin());
        document.getElementById('registerBtn')?.addEventListener('click', () => this.showRegister());
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    async loadInitialData() {
        try {
            this.appState.isLoading = true;
            await Promise.all([
                this.loadCryptoRates(),
                this.validateAuth()
            ]);
        } catch (error) {
            console.error('Initial load error:', error);
            this.appState.lastError = error.message;
        } finally {
            this.appState.isLoading = false;
        }
    }

    async loadCryptoRates() {
        try {
            const response = await fetch('/.netlify/functions/coinapi');
            if (!response.ok) throw new Error('Failed to load crypto rates');
            this.cryptoRates = await response.json();
        } catch (error) {
            console.error('Crypto rates error:', error);
            throw error;
        }
    }

    async loadDashboardData() {
        if (!this.currentUser) return;
        
        try {
            const [transactions, balances] = await Promise.all([
                this.loadTransactions(),
                this.loadBalances()
            ]);
            
            this.updateDashboardUI(transactions, balances);
        } catch (error) {
            console.error('Dashboard load error:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

// Instance globale
const app = new CryptoBoostApp();

// Export pour utilisation dans d'autres modules
export { app as CryptoBoostApp };
