// CryptoBoost Vanilla JS Application
class CryptoBoostApp {
    constructor() {
        this.currentUser = null;
        this.cryptoRates = {};
        this.transactions = [];
        this.settings = {
            exchange_fee_pct: 0.2,
            fees: { BTC: 0.0002, ETH: 0.003, USDT: 2, USDC: 2 }
        };
        this.wallets = {
            BTC: 0,
            ETH: 0,
            USDT: 0,
            USDC: 0
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadUserData();
        this.loadCryptoRates();
        setInterval(() => this.loadCryptoRates(), 30000); // Update rates every 30s
    }

    // Authentication
    // Authentication is handled by auth.js. This app syncs with getCurrentUser() when needed.

    // Logout handled by auth.js (global logout). Keep UI helper if needed.
    logout() {
        this.currentUser = null;
        this.showHome();
    }

    // API Calls
    async apiCall(method, endpoint, data = null) {
        // Switch to GitHub-backed storage API
        const baseUrl = '/.netlify/functions/github-db';
        const url = `${baseUrl}?collection=${endpoint.split('?')[0]}&${endpoint.split('?')[1] || ''}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to localStorage for demo
            return this.localStorageFallback(method, endpoint, data);
        }
    }

    // Local Storage Fallback
    localStorageFallback(method, endpoint, data) {
        const key = endpoint.split('?')[0];
        let stored = JSON.parse(localStorage.getItem(key) || '[]');

        switch (method) {
            case 'GET':
                return stored;
            case 'POST':
                data.id = Date.now().toString();
                data.created_at = new Date().toISOString();
                stored.push(data);
                localStorage.setItem(key, JSON.stringify(stored));
                return data;
            case 'PUT':
                const index = stored.findIndex(item => item.id === data.id);
                if (index !== -1) {
                    stored[index] = { ...stored[index], ...data };
                    localStorage.setItem(key, JSON.stringify(stored));
                }
                return data;
            default:
                return stored;
        }
    }

    // Crypto Rates
    async loadCryptoRates() {
        try {
            if (window.cryptoAPI && typeof window.cryptoAPI.getRates === 'function') {
                const rates = await window.cryptoAPI.getRates();
                // Normalize to simple price map for existing code
                this.cryptoRates = Object.fromEntries(
                    Object.entries(rates).map(([k, v]) => [k, v.price])
                );
            }
            this.updateWalletDisplays();
        } catch (error) {
            console.error('Error loading crypto rates:', error);
        }
    }

    async loadSettings() {
        try {
            const res = await this.apiCall('GET', 'settings');
            const settings = Array.isArray(res) ? res.find(s=>s.id==='app-settings') : (res && res.id==='app-settings'? res : null);
            if (settings) this.settings = settings;
        } catch (e) {}
    }

    // User Data
    loadUserData() {
        try {
            const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            if (user) {
                this.currentUser = user;
            this.loadUserWallets();
            this.showDashboard();
            }
        } catch (e) {
            // no-op
        }
    }

    saveUserData() {
        if (this.currentUser) {
            // Persist profile fields alongside auth.js user
            try {
                const storedStr = localStorage.getItem('user');
                const stored = storedStr ? JSON.parse(storedStr) : {};
                const merged = { ...stored, ...this.currentUser };
                localStorage.setItem('user', JSON.stringify(merged));
            } catch (e) {
                // ignore
            }
            localStorage.setItem('cryptoboost_wallets', JSON.stringify(this.wallets));
        }
    }

    loadUserWallets() {
        const saved = localStorage.getItem('cryptoboost_wallets');
        if (saved) {
            this.wallets = JSON.parse(saved);
            this.updateWalletDisplays();
        }
        // Try remote wallets
        if (this.currentUser?.id) {
            this.apiCall('GET', `wallets?user_id=${this.currentUser.id}`)
                .then(items => {
                    if (Array.isArray(items) && items.length) {
                        const agg = { BTC: 0, ETH: 0, USDT: 0, USDC: 0 };
                        items.forEach(w => { if (agg[w.crypto] != null) agg[w.crypto] = w.balance; });
                        this.wallets = agg;
        this.updateWalletDisplays();
                        localStorage.setItem('cryptoboost_wallets', JSON.stringify(this.wallets));
                    }
                })
                .catch(() => {});
        }
    }

    loadUserData() {
        try {
            if (!this.currentUser) {
                console.log('No current user to load data for');
                return;
            }

            console.log('Loading user data for:', this.currentUser.email);

            // Load user-specific data from GitHub DB
            this.loadUserWallets();
            this.loadUserTransactions();
            this.loadUserInvestments();
            this.loadUserNotifications();

        } catch (error) {
            console.log('Error loading user data:', error);
        }
    }

    updateUserDisplay() {
        try {
            if (!this.currentUser) return;

            // Update user name in header/navigation
            const userElements = document.querySelectorAll('.user-name, .user-display-name');
            userElements.forEach(el => {
                if (el && this.currentUser.name) {
                    el.textContent = this.currentUser.name;
                }
            });

            // Update user email if displayed
            const emailElements = document.querySelectorAll('.user-email');
            emailElements.forEach(el => {
                if (el && this.currentUser.email) {
                    el.textContent = this.currentUser.email;
                }
            });

            // Update user role indicator
            const roleElements = document.querySelectorAll('.user-role');
            roleElements.forEach(el => {
                if (el && this.currentUser.role) {
                    el.textContent = this.currentUser.role.toUpperCase();
                    el.className = el.className.replace(/role-(admin|client)/g, '') + ` role-${this.currentUser.role}`;
                }
            });

            // Update login time if displayed
            const loginTimeElements = document.querySelectorAll('.login-time');
            loginTimeElements.forEach(el => {
                if (el && this.currentUser.loginTime) {
                    const loginDate = new Date(this.currentUser.loginTime);
                    el.textContent = loginDate.toLocaleString();
                }
            });

            console.log('User display updated');
        } catch (error) {
            console.log('Error updating user display:', error);
        }
    }

    updateWalletDisplays() {
        Object.keys(this.wallets).forEach(crypto => {
            const balanceEl = document.getElementById(`${crypto.toLowerCase()}-balance`);
            if (balanceEl) {
                const balance = this.wallets[crypto];
                const rate = this.cryptoRates[crypto] || 0;
                const usdValue = balance * rate;
                balanceEl.textContent = ['USDT', 'USDC'].includes(crypto) ? balance.toFixed(2) : balance.toFixed(8);
                const usdEl = balanceEl.nextElementSibling;
                if (usdEl) {
                    usdEl.textContent = `≈ ${usdValue.toFixed(2)} €`;
                }
            }
        });
    }

    // UI Management
    showLogin() {
        document.getElementById('loginModal').classList.remove('hidden');
    }

    hideLogin() {
        document.getElementById('loginModal').classList.add('hidden');
        const emailEl = document.getElementById('email') || document.getElementById('loginEmail');
        const passEl = document.getElementById('password') || document.getElementById('loginPassword');
        if (emailEl) emailEl.value = '';
        if (passEl) passEl.value = '';
    }

    showHome() {
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        try {
            // Sync current user from auth system on entry
            const authUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

            if (!authUser) {
                console.log('No authenticated user found, redirecting to login');
                if (typeof showLogin === 'function') {
                    showLogin();
                } else {
                    window.location.href = 'index.html';
                }
                return;
            }

            // Update current user
            this.currentUser = authUser;

            // Validate user has required fields
            if (!this.currentUser.id || !this.currentUser.email || !this.currentUser.role) {
                console.log('Invalid user data, redirecting to login');
                if (typeof logout === 'function') {
                    logout();
                } else {
                    window.location.href = 'index.html';
                }
                return;
            }

            console.log('Loading dashboard for user:', this.currentUser.email);

            // Hide main content and show dashboard
            const mainContent = document.getElementById('main-content');
            const dashboard = document.getElementById('dashboard');

            if (mainContent) {
                mainContent.classList.add('hidden');
            }

            if (dashboard) {
                dashboard.classList.remove('hidden');

                // Initialize dashboard with loading state
                this.showLoadingState();

                // Load dashboard data
                this.showPage('dashboard');
                this.loadUserData();
                this.loadTransactions();
                this.loadCryptoRates();
                this.loadInvestments();
                this.loadNotifications();
                this.loadSupportTickets();

                // Update UI elements
                this.updateUserDisplay();
                this.updateWalletDisplays();

                console.log('Dashboard loaded successfully');
            } else {
                console.log('Dashboard element not found');
                window.location.reload();
            }
        } catch (error) {
            console.log('Error loading dashboard:', error);
            if (typeof showAlert === 'function') {
                showAlert('Erreur de chargement du dashboard', 'error');
            }
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    showPage(pageName) {
        // Hide all dashboard pages
        const pages = ['wallets-page', 'transactions-page', 'investments-page', 'profile-page', 'support-page'];
        pages.forEach(page => {
            document.getElementById(page).classList.add('hidden');
        });
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600');
            btn.classList.add('hover:bg-gray-700');
        });
        
        if (pageName === 'dashboard') {
            // Show main dashboard content
            document.querySelector('#dashboard > .container').style.display = 'block';
            document.querySelector('.nav-btn').classList.add('bg-blue-600');
        } else {
            // Hide main dashboard content and show specific page
            document.querySelector('#dashboard > .container').style.display = 'none';
            document.getElementById(pageName + '-page').classList.remove('hidden');
            
            // Update active nav button
            const activeBtn = document.querySelector(`[onclick="showPage('${pageName}')"]`);
            if (activeBtn) {
                activeBtn.classList.remove('hover:bg-gray-700');
                activeBtn.classList.add('bg-blue-600');
            }
            
            // Load page-specific data
            this.loadPageData(pageName);
        }
    }

    showLoadingState() {
        try {
            // Add loading class to dashboard elements
            const dashboardElements = [
                '.wallet-card', '.transaction-list', '.investment-list',
                '.notification-list', '.support-tickets'
            ];

            dashboardElements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el) el.classList.add('loading');
                });
            });

            console.log('Loading state activated');
        } catch (error) {
            console.log('Error in showLoadingState:', error);
        }
    }

    hideLoadingState() {
        try {
            // Remove loading class from dashboard elements
            const dashboardElements = [
                '.wallet-card', '.transaction-list', '.investment-list',
                '.notification-list', '.support-tickets'
            ];

            dashboardElements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el) el.classList.remove('loading');
                });
            });

            console.log('Loading state deactivated');
        } catch (error) {
            console.log('Error in hideLoadingState:', error);
        }
    }

    setupSessionMonitoring() {
        // Check session validity every 5 minutes
        setInterval(() => {
            this.checkSessionValidity();
        }, 5 * 60 * 1000); // 5 minutes

        // Check session on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkSessionValidity();
            }
        });

        // Check session on window focus
        window.addEventListener('focus', () => {
            this.checkSessionValidity();
        });

        console.log('Session monitoring setup completed');
    }

    checkSessionValidity() {
        try {
            if (typeof validateAuth === 'function') {
                const isValid = validateAuth();
                if (!isValid) {
                    console.log('Session expired, redirecting to login');
                    if (typeof showAlert === 'function') {
                        showAlert('Votre session a expiré. Veuillez vous reconnecter.', 'warning');
                    }
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                    return false;
                }
            }

            // Update user activity
            if (this.currentUser) {
                this.currentUser.lastActivity = new Date().toISOString();
                try {
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                } catch (error) {
                    console.log('Failed to update user activity');
                }
            }

            return true;
        } catch (error) {
            console.log('Session validity check error:', error);
            return false;
        }
    }

    initializeAppWithSessionCheck() {
        try {
            console.log('Initializing app with session management...');

            // Setup global error handling
            this.setupGlobalErrorHandling();

            // Check for existing session
            this.checkExistingSession();

            // Initialize the app
            this.init();

            console.log('App initialized with session management');
        } catch (error) {
            console.log('Error initializing app with session management:', error);
            if (typeof showAlert === 'function') {
                showAlert('Erreur d\'initialisation de l\'application', 'error');
            }
        }
    }

    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.log('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.log('JavaScript error:', event.error);
            // Don't show alert for every JS error, only critical ones
        });

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            if (this.currentUser) {
                // Save current state
                try {
                    this.currentUser.lastActivity = new Date().toISOString();
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                } catch (error) {
                    console.log('Failed to save state on unload');
                }
            }
        });

        console.log('Global error handling setup completed');
    }

    checkExistingSession() {
        try {
            // Check if there's a valid session
            const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            const token = localStorage.getItem('authToken');

            if (user && token && typeof validateAuth === 'function') {
                const isValid = validateAuth();
                if (isValid) {
                    console.log('Existing valid session found');
                    this.currentUser = user;
                    // Auto-load dashboard if on index page
                    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
                        setTimeout(() => {
                            if (typeof showDashboard === 'function') {
                                showDashboard();
                            }
                        }, 100);
                    }
                } else {
                    console.log('Existing session invalid, clearing');
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                }
            }
        } catch (error) {
            console.log('Error checking existing session:', error);
        }
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'wallets':
                this.loadDetailedWallets();
                break;
            case 'transactions':
                this.loadAllTransactions();
                break;
            case 'investments':
                this.loadInvestments();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'support':
                this.loadSupportTickets();
                break;
        }
    }

    loadDetailedWallets() {
        const container = document.getElementById('detailed-wallets');
        container.innerHTML = Object.keys(this.wallets).map(crypto => {
            const balance = this.wallets[crypto];
            const rate = this.cryptoRates[crypto] || 0;
            const usdValue = balance * rate;
            
            return `
                <div class="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                        <p class="font-medium">${crypto}</p>
                        <p class="text-sm text-gray-400">${balance.toFixed(8)}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold">$${usdValue.toFixed(2)}</p>
                        <p class="text-sm text-gray-400">$${rate.toFixed(2)}/unit</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadAllTransactions() {
        const container = document.getElementById('all-transactions-list');
        if (!container) return;
        container.innerHTML = '<p class="text-gray-400">Chargement des transactions...</p>';
        
        try {
            const allTx = await this.apiCall('GET', 'transactions');
            const userId = this.currentUser?.id;
            this.transactions = Array.isArray(allTx) ? allTx.filter(t => t.user_id === userId) : [];
            this.renderTransactionsList(this.transactions, 'all-transactions-list');

        const filter = document.getElementById('tx-filter');
            if (filter && !filter.__bound) {
        filter.addEventListener('change', () => {
            this.filterTransactions(filter.value);
        });
                filter.__bound = true;
            }
            // Advanced filters: by date and crypto if present
            const dateFrom = document.getElementById('tx-date-from');
            const dateTo = document.getElementById('tx-date-to');
            const cryptoSel = document.getElementById('tx-crypto');
            const apply = () => {
                let list = [...this.transactions];
                if (dateFrom?.value) list = list.filter(t => new Date(t.created_at) >= new Date(dateFrom.value));
                if (dateTo?.value) list = list.filter(t => new Date(t.created_at) <= new Date(dateTo.value));
                if (cryptoSel?.value) list = list.filter(t => (t.crypto||'').includes(cryptoSel.value));
                this.renderTransactionsList(list, 'all-transactions-list');
            };
            if (dateFrom && !dateFrom.__b) { dateFrom.addEventListener('change', apply); dateFrom.__b=true; }
            if (dateTo && !dateTo.__b) { dateTo.addEventListener('change', apply); dateTo.__b=true; }
            if (cryptoSel && !cryptoSel.__b) { cryptoSel.addEventListener('change', apply); cryptoSel.__b=true; }
        } catch (e) {
            console.error('Error loading all transactions:', e);
            container.innerHTML = '<p class="text-red-400">Erreur de chargement des transactions</p>';
        }
    }

    filterTransactions(type) {
        if (!Array.isArray(this.transactions)) return;
        const filtered = type === 'all' ? this.transactions : this.transactions.filter(t => t.type === type);
        this.renderTransactionsList(filtered, 'all-transactions-list');
    }

    renderTransactionsList(list, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!list || list.length === 0) {
            container.innerHTML = '<p class="text-gray-400">Aucune transaction</p>';
            return;
        }
        container.innerHTML = list.map(tx => `
            <div class="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                    <p class="font-medium">${tx.type.toUpperCase()} - ${tx.crypto}</p>
                    <p class="text-sm text-gray-400">${new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold">${tx.amount} ${tx.crypto}</p>
                    <p class="text-sm ${tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}">${tx.status}</p>
                </div>
            </div>
        `).join('');
    }

    loadInvestments() {
        const container = document.getElementById('active-investments');
        if (!container) return;
        container.innerHTML = '<p class="text-gray-400">Chargement des investissements...</p>';
        // Load plans for client to subscribe (simple list for MVP)
        this.apiCall('GET', 'plans').then(plans => {
            const list = Array.isArray(plans) ? plans.filter(p=>p.status!=='inactive') : [];
            const html = list.map(p => `
                <div class="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                        <p class="font-medium">${p.name} • ${p.duration_days}j</p>
                        <p class="text-sm text-gray-300">ROI ${p.roi_min}%–${p.roi_max}% • Min ${p.min_eur} €</p>
                    </div>
                    <button class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded" onclick="subscribePlan('${p.id}')">Souscrire</button>
                </div>
            `).join('');
            const subsBox = `<div class=\"mt-6\">\n                <div class=\"flex items-center justify-between mb-2\">\n                    <h3 class=\"text-lg font-bold\">Mes Souscriptions</h3>\n                    <div class=\"flex gap-2\">\n                        <select id=\"subs-plan-filter\" class=\"bg-gray-700 rounded px-2 py-1\"><option value=\"\">Tous plans</option></select>\n                        <select id=\"subs-status-filter\" class=\"bg-gray-700 rounded px-2 py-1\"><option value=\"\">Tous statuts</option><option>ACTIVE</option><option>CLOSED</option><option>CANCELLED</option></select>\n                        <select id=\"subs-sort\" class=\"bg-gray-700 rounded px-2 py-1\"><option value=\"recent\">Plus récent</option><option value=\"gains_desc\">Gains ↓</option><option value=\"gains_asc\">Gains ↑</option><option value=\"roi_desc\">ROI ↓</option><option value=\"roi_asc\">ROI ↑</option></select>\n                    </div>\n                </div>\n                <div id=\"subs-list\" class=\"space-y-3\">Chargement...</div>\n            </div>`;
            container.innerHTML = (html || '<p class="text-gray-400">Aucun plan disponible</p>') + subsBox;
            this.loadSubscriptions();
        }).catch(()=>{
            container.innerHTML = '<p class="text-red-400">Erreur de chargement</p>';
        });
    }

    async loadSubscriptions() {
        const el = document.getElementById('subs-list');
        if (!el || !this.currentUser?.id) return;
        try {
            const subs = await this.apiCall('GET', `subscriptions?user_id=${this.currentUser.id}`);
            let arr = Array.isArray(subs)?subs:[];
            // filters
            const planFilter = document.getElementById('subs-plan-filter');
            const statusFilter = document.getElementById('subs-status-filter');
            const sortSel = document.getElementById('subs-sort');
            const planVal = planFilter ? planFilter.value : '';
            const statusVal = statusFilter ? statusFilter.value : '';
            if (planVal) arr = arr.filter(s=>s.plan_id===planVal);
            if (statusVal) arr = arr.filter(s=>s.status===statusVal);
            // sort
            const computeROI = (s)=>{ const a=s.amount_eur||0; const g=s.accrued_eur||0; return a>0 ? (g/a) : 0; };
            if (sortSel) {
                const v = sortSel.value;
                if (v==='gains_desc') arr.sort((a,b)=>(b.accrued_eur||0)-(a.accrued_eur||0));
                else if (v==='gains_asc') arr.sort((a,b)=>(a.accrued_eur||0)-(b.accrued_eur||0));
                else if (v==='roi_desc') arr.sort((a,b)=>computeROI(b)-computeROI(a));
                else if (v==='roi_asc') arr.sort((a,b)=>computeROI(a)-computeROI(b));
                else arr.sort((a,b)=>new Date(b.start_date)-new Date(a.start_date));
            }
            if (arr.length === 0) { el.innerHTML = '<p class="text-gray-400">Aucune souscription</p>'; return; }
            let total = 0, gains = 0;
            const rows = arr.map(s=>{ total += s.amount_eur||0; gains += s.accrued_eur||0; const roi = (s.amount_eur>0? (s.accrued_eur||0)/s.amount_eur : 0)*100; return `
                <div class=\"p-3 bg-gray-700 rounded\">\n                    <div class=\"flex justify-between\">\n                        <span>${s.plan_name} • ${s.duration_days}j</span>
                        <span class=\"text-green-400\">${(s.accrued_eur||0).toFixed(2)} € (${roi.toFixed(2)}%)</span>
                    </div>
                    <div class=\"text-sm text-gray-300\">Investi: ${s.amount_eur.toFixed(2)} € • Début: ${new Date(s.start_date).toLocaleDateString()}</div>
                </div>`; }).join('');
            el.innerHTML = `<div class=\"mb-3\"><div class=\"flex justify-between\"><span>Total Investi</span><strong>${total.toFixed(2)} €</strong></div><div class=\"flex justify-between\"><span>Gains Totaux</span><strong class=\"text-green-400\">${gains.toFixed(2)} €</strong></div></div>` + rows;
            // Also reflect KPIs if present
            const totalEl = document.getElementById('total-invested'); if (totalEl) totalEl.textContent = `${total.toFixed(2)} €`;
            const gainsEl = document.getElementById('total-gains'); if (gainsEl) gainsEl.textContent = `${gains.toFixed(2)} €`;
            const roiEl = document.getElementById('roi-percentage'); if (roiEl) roiEl.textContent = total>0 ? `${((gains/total)*100).toFixed(2)}%` : '0%';
            // bind filter listeners once
            if (planFilter && !planFilter.__b) { planFilter.addEventListener('change', ()=>this.loadSubscriptions()); planFilter.__b=true; }
            if (statusFilter && !statusFilter.__b) { statusFilter.addEventListener('change', ()=>this.loadSubscriptions()); statusFilter.__b=true; }
            if (sortSel && !sortSel.__b) { sortSel.addEventListener('change', ()=>this.loadSubscriptions()); sortSel.__b=true; }
        } catch(e) { el.innerHTML = '<p class="text-red-400">Erreur</p>'; }
    }

    loadProfile() {
        if (this.currentUser) {
            document.getElementById('profile-name').value = this.currentUser.full_name || '';
            document.getElementById('profile-email').value = this.currentUser.email || '';
            document.getElementById('profile-phone').value = this.currentUser.phone || '';
        }
    }

    loadSupportTickets() {
        const container = document.getElementById('support-tickets');
        container.innerHTML = '<p class="text-gray-400">Chargement des tickets...</p>';
        // Load notifications list for client and allow mark as read
        const box = document.getElementById('support-tickets');
        if (!box || !this.currentUser?.id) return;
        // tickets
        this.apiCall('GET', `support_tickets?user_id=${this.currentUser.id}`).then(tickets => {
            const arr = Array.isArray(tickets)?tickets:[];
            if (arr.length) {
                box.innerHTML = arr.map(t=>`
                    <div class=\"p-3 bg-gray-700 rounded\">\n                        <div class=\"flex justify-between\"><span class=\"font-medium\">${t.subject}</span><span class=\"text-xs text-gray-400\">${t.status}</span></div>\n                        <div class=\"text-sm text-gray-300\">${t.message}</div>\n                        <div class=\"text-xs text-gray-400\">${new Date(t.created_at).toLocaleString()}</div>\n                    </div>
                `).join('');
            }
        }).catch(()=>{});
        this.apiCall('GET', `notifications?user_id=${this.currentUser.id}`).then(list => {
            const arr = Array.isArray(list)?list:[];
            if (arr.length===0) { box.innerHTML = '<p class="text-gray-400">Aucun ticket de support</p>'; }
            const notifBox = document.getElementById('notifications-list');
            const filterSel = document.getElementById('notif-type-filter');
            const apply = () => {
                const type = filterSel?.value || '';
                const items = type ? arr.filter(n=>n.type===type) : arr;
                notifBox.innerHTML = items.length? items.map(n => `
                <div class=\"p-3 bg-gray-700 rounded flex items-center justify-between\">\n                    <div>\n                        <div class=\"font-medium\">${n.title}</div>\n                        <div class=\"text-sm text-gray-300\">${n.message} • ${new Date(n.created_at).toLocaleDateString()}</div>\n                    </div>\n                    <div>\n                        ${n.read? '<span class=\\"text-xs text-gray-400\\">Lu</span>' : `<button class=\\"text-blue-400 hover:text-blue-300\\" onclick=\\"markNotifRead('${n.id}')\\">Marquer lu</button>`}
                    </div>\n                </div>
            `).join('') : '<p class="text-gray-400">Aucune notification</p>';
                // update badge
                const count = arr.filter(n=>!n.read).length;
                const badge = document.getElementById('notif-count');
                if (badge) { badge.textContent = String(count); badge.classList.toggle('hidden', count===0); }
            };
            if (filterSel && !filterSel.__b) { filterSel.addEventListener('change', apply); filterSel.__b=true; }
            apply();
        }).catch(()=>{ box.innerHTML = '<p class="text-red-400">Erreur de chargement</p>'; });
    }

    // Transactions
    async loadTransactions() {
        try {
            const transactions = await this.apiCall('GET', 'transactions');
            const userTransactions = transactions.filter(t => t.user_id === this.currentUser?.id);
            this.displayTransactions(userTransactions.slice(0, 5)); // Show last 5
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    displayTransactions(transactions) {
        const container = document.getElementById('transactions-list');
        if (transactions.length === 0) {
            container.innerHTML = '<p class="text-gray-400">Aucune transaction récente</p>';
            return;
        }

        container.innerHTML = transactions.map(tx => `
            <div class="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                    <p class="font-medium">${tx.type.toUpperCase()} - ${tx.crypto}</p>
                    <p class="text-sm text-gray-400">${new Date(tx.created_at).toLocaleDateString()}${tx.reject_reason ? ' • Raison: ' + tx.reject_reason : ''}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold">${tx.amount} ${tx.crypto}</p>
                    <p class="text-sm ${tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}">
                        ${tx.status}
                    </p>
                </div>
            </div>
        `).join('');
    }

    // Quick Actions
    showDeposit() {
        const modal = document.getElementById('depositModal');
        if (modal) {
            modal.classList.remove('hidden');
            const assetEl = document.getElementById('dp-asset');
            const addrEl = document.getElementById('dp-address');
            const refEl = document.getElementById('dp-ref');
            const qrEl = document.getElementById('dp-qr');
            const addresses = (this.settings && this.settings.master_addresses) ? this.settings.master_addresses : { BTC: '', ETH: '', USDT: '', USDC: '' };
            const update = () => { 
                const address = addresses[assetEl.value] || '—';
                addrEl.textContent = address; 
                if (qrEl && window.QRCode) { qrEl.innerHTML = ''; new QRCode(qrEl, { text: address, width: 120, height: 120 }); }
            };
            assetEl.addEventListener('change', update); update();
            // Generate reference
            const ref = 'DP-' + Date.now().toString(36).toUpperCase();
            if (refEl) refEl.textContent = ref;
        }
    }

    showWithdraw() {
        const modal = document.getElementById('withdrawModal');
        if (modal) {
            modal.classList.remove('hidden');
            const assetEl = document.getElementById('wd-asset');
            const amtEl = document.getElementById('wd-amount');
            const prevEl = document.getElementById('wd-preview');
            const noteEl = document.getElementById('wd-fee-note');
            const update = () => {
                const a = assetEl.value; const amount = parseFloat(amtEl.value||'0');
                if (!amount) { prevEl.textContent = ''; return; }
                const rate = this.cryptoRates[a] || 0;
                const fee = (this.settings?.fees && this.settings.fees[a]!=null) ? this.settings.fees[a] : 0;
                const eur = amount * rate;
                const feeText = ['USDT','USDC'].includes(a) ? `${fee.toFixed(2)} ${a}` : `${fee.toFixed(8)} ${a}`;
                prevEl.textContent = `Aperçu: ${amount} ${a} ≈ ${(eur).toFixed(2)} € • Frais: ${feeText}`;
                if (noteEl) noteEl.textContent = `Frais de retrait ${a}: ${feeText}`;
            };
            ['input','change'].forEach(ev=>{ assetEl.addEventListener(ev, update); amtEl.addEventListener(ev, update); });
            update();
        }
    }

    showExchange() {
        const modal = document.getElementById('exchangeModal');
        if (modal) {
            modal.classList.remove('hidden');
            const preview = document.getElementById('ex-preview');
            const feeNote = document.getElementById('ex-fee-note');
            const fromSel = document.getElementById('ex-from');
            const toSel = document.getElementById('ex-to');
            const amt = document.getElementById('ex-amount');
            const updatePreview = () => {
                const from = fromSel.value;
                const to = toSel.value;
                const amount = parseFloat(amt.value || '0');
                if (!amount || from === to) { preview.textContent = ''; return; }
                const fromRate = this.cryptoRates[from];
                const toRate = this.cryptoRates[to];
                if (!fromRate || !toRate) { preview.textContent = ''; return; }
                const result = (amount * fromRate) / toRate;
                const feePct = this.settings?.exchange_fee_pct || 0.2;
                const fee = result * (feePct / 100);
                const receive = result - fee;
                preview.textContent = `Taux: 1 ${from} = ${(fromRate/toRate).toFixed(6)} ${to} • Montant reçu estimé: ${receive.toFixed(8)} ${to} (frais ${feePct}%: ${fee.toFixed(8)} ${to})`;
                if (feeNote) feeNote.textContent = `Frais d'échange appliqués: ${feePct}%`;
            };
            ['change','input'].forEach(ev=>{
                fromSel.addEventListener(ev, updatePreview);
                toSel.addEventListener(ev, updatePreview);
                amt.addEventListener(ev, updatePreview);
            });
            updatePreview();
        }
    }

    // Modal actions
    closeExchangeModal() { const m = document.getElementById('exchangeModal'); if (m) m.classList.add('hidden'); }
    closeWithdrawModal() { const m = document.getElementById('withdrawModal'); if (m) m.classList.add('hidden'); }
    closeDepositModal() { const m = document.getElementById('depositModal'); if (m) m.classList.add('hidden'); }
    copyDepositAddress() { const el = document.getElementById('dp-address'); if (el?.textContent) { navigator.clipboard.writeText(el.textContent); alert('Adresse copiée'); } }
    async confirmDeposit() {
        const asset = document.getElementById('dp-asset').value;
        const amount = parseFloat(document.getElementById('dp-amount').value||'0');
        const address = document.getElementById('dp-address').textContent;
        const ref = document.getElementById('dp-ref').textContent;
        if (!amount) { alert('Veuillez saisir un montant'); return; }
        await this.createTransaction('deposit', asset, amount);
        // Attach metadata via PUT (reference/address)
        try {
            const list = await this.apiCall('GET', 'transactions');
            const last = Array.isArray(list) ? list.find(t => t.user_id === this.currentUser.id && t.type==='deposit' && !t.reference) : null;
            if (last) {
                last.reference = ref;
                last.deposit_address = address;
                await this.apiCall('PUT', 'transactions', last);
            }
        } catch (e) {}
        this.closeDepositModal();
        alert('Demande de dépôt créée. En attente de validation admin.');
    }

    async confirmExchange() {
        const from = document.getElementById('ex-from').value;
        const to = document.getElementById('ex-to').value;
        const amount = parseFloat(document.getElementById('ex-amount').value||'0');
        if (!amount || from === to) return;
        if (this.wallets[from] < amount) { alert('Solde insuffisant'); return; }
        const fromRate = this.cryptoRates[from];
        const toRate = this.cryptoRates[to];
        const result = (amount * fromRate) / toRate;
        const feePct = this.settings?.exchange_fee_pct || 0.2; const fee = result * (feePct/100); const receive = result - fee;
        this.wallets[from] -= amount;
        this.wallets[to] += receive;
        // Persist wallets remotely
        try { await this.syncWalletBalance(this.currentUser.id, from, this.wallets[from]); } catch(e) {}
        try { await this.syncWalletBalance(this.currentUser.id, to, this.wallets[to]); } catch(e) {}
        // Record exchange with metadata
        const tx = {
            user_id: this.currentUser.id,
            type: 'exchange',
            crypto: `${from}-${to}`,
            amount: amount,
            status: 'completed',
            created_at: new Date().toISOString(),
            rate_used: fromRate / toRate,
            fee_pct: feePct,
            fee_amount: fee,
            quote: 'EUR'
        };
        await this.apiCall('POST', 'transactions', tx);
        this.updateWalletDisplays(); this.saveUserData(); this.closeExchangeModal();
        alert(`Échange réussi: ${amount} ${from} → ${receive.toFixed(8)} ${to}`);
    }

    async syncWalletBalance(userId, crypto, balance) {
        // fetch wallets for user, update or create
        const items = await this.apiCall('GET', `wallets?user_id=${userId}`);
        const arr = Array.isArray(items) ? items : [];
        const existing = arr.find(w => w.crypto === crypto);
        if (existing) {
            existing.balance = balance;
            existing.updated_at = new Date().toISOString();
            await this.apiCall('PUT', 'wallets', existing);
            } else {
            await this.apiCall('POST', 'wallets', { user_id: userId, crypto, balance, updated_at: new Date().toISOString() });
        }
    }

    async confirmWithdraw() {
        const asset = document.getElementById('wd-asset').value;
        const amount = parseFloat(document.getElementById('wd-amount').value||'0');
        const addr = document.getElementById('wd-address').value;
        if (!amount || !addr) return;
        if (this.wallets[asset] < amount) { alert('Solde insuffisant'); return; }
        await this.createTransaction('withdraw', asset, amount);
        this.closeWithdrawModal();
        alert('Demande de retrait créée. En attente de validation admin.');
    }

    showInvest() {
        const plans = ['Débutant (5-8%)', 'Standard (8-12%)', 'Premium (12-18%)', 'VIP (18-25%)'];
        const plan = prompt(`Plan d'investissement:\n${plans.join('\n')}\n\nEntrez le numéro (1-4):`);
        const amount = parseFloat(prompt('Montant en USDT:'));
        
        if (plan && amount && this.wallets.USDT >= amount) {
            this.wallets.USDT -= amount;
            this.createTransaction('invest', 'USDT', amount);
            this.updateWalletDisplays();
            this.saveUserData();
            
            alert(`Investissement de ${amount} USDT dans le plan ${plans[parseInt(plan)-1]} créé avec succès!`);
        } else if (amount > this.wallets.USDT) {
            alert('Solde USDT insuffisant');
        }
    }

    async createTransaction(type, crypto, amount) {
        const transaction = {
            user_id: this.currentUser.id,
            type: type,
            crypto: crypto,
            amount: amount,
            status: type === 'withdraw' ? 'awaiting_admin' : 'pending',
            created_at: new Date().toISOString()
        };

        try {
            await this.apiCall('POST', 'transactions', transaction);
            
            // Save to localStorage as backup
            let localTx = JSON.parse(localStorage.getItem('cryptoboost_transactions') || '[]');
            localTx.push(transaction);
            localStorage.setItem('cryptoboost_transactions', JSON.stringify(localTx));
            
            // For deposit, wallets credited upon admin approval (not here)
            
            this.loadTransactions();
            alert(`Transaction ${type} créée avec succès!`);
        } catch (error) {
            console.error('Transaction error:', error);
            alert('Erreur lors de la création de la transaction');
        }
    }
}

// Global functions for HTML onclick events
let app;

function showLogin() {
    app.showLogin();
}

function hideLogin() {
    app.hideLogin();
}

function showRegister() {
    const m = document.getElementById('registerModal');
    if (m) m.classList.remove('hidden');
}
function hideRegister() {
    const m = document.getElementById('registerModal');
    if (m) m.classList.add('hidden');
}

async function handleRegister(event) {
    event.preventDefault();
    const full_name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!full_name || !email || !password) { alert('Champs requis'); return; }
    if (password.length < 6) { alert('Le mot de passe doit contenir au moins 6 caractères'); return; }
    try {
        // Simple existence check
        const existing = await app.apiCall('GET', `users?email=${encodeURIComponent(email)}`);
        if (Array.isArray(existing) && existing.find(u=>u.email===email)) {
            alert('Email déjà utilisé'); return;
        }
        const user = { full_name, email, password, role: 'client', status: 'active' };
        const created = await app.apiCall('POST', 'users', user);
        if (created && created.id) {
            alert('Compte créé, vous pouvez vous connecter.');
            hideRegister();
            showLogin();
        } else {
            alert('Erreur inscription');
        }
    } catch (e) { alert('Erreur inscription'); }
}

// Remove conflicting handleLogin; auth.js handles login()

// Do not shadow global logout from auth.js

function showDeposit() {
    app.showDeposit();
}

function showWithdraw() {
    app.showWithdraw();
}

function showExchange() {
    app.showExchange();
}

function closeExchangeModal() { app.closeExchangeModal(); }
function closeWithdrawModal() { app.closeWithdrawModal(); }
function closeDepositModal() { app.closeDepositModal(); }
function copyDepositAddress() { app.copyDepositAddress(); }
function confirmExchange() { app.confirmExchange(); }
function confirmWithdraw() { app.confirmWithdraw(); }
function confirmDeposit() { app.confirmDeposit(); }

function closeMySubscription(id) { app.closeMySubscription(id); }

function showInvest() {
    app.showInvest();
}

function showPage(pageName) {
    app.showPage(pageName);
}

// Investment subscription
async function subscribePlan(planId) {
    if (!app.currentUser) { showLogin(); return; }
    const amountEurStr = prompt('Montant en EUR à investir:');
    const amountEur = parseFloat(amountEurStr || '0');
    if (!amountEur || amountEur <= 0) return;
    const asset = prompt('Choisir l\'actif à débiter (BTC, ETH, USDT, USDC):', 'USDT');
    const assetUp = (asset||'').toUpperCase();
    if (!['BTC','ETH','USDT','USDC'].includes(assetUp)) { alert('Actif invalide'); return; }
    // Pull plan to validate min/max
    try {
        const plans = await app.apiCall('GET', 'plans');
        const plan = Array.isArray(plans) ? plans.find(p=>p.id===planId) : null;
        if (!plan) { alert('Plan introuvable'); return; }
        if (amountEur < plan.min_eur) { alert('Montant en dessous du minimum'); return; }
        // Convert EUR -> asset amount
        const rate = app.cryptoRates[assetUp] || 0;
        if (!rate) { alert('Taux indisponible'); return; }
        const neededAsset = amountEur / rate;
        // Check balance
        if ((app.wallets[assetUp]||0) < neededAsset) { alert('Solde insuffisant'); return; }
        // Debit wallet
        app.wallets[assetUp] = (app.wallets[assetUp]||0) - neededAsset;
        await app.syncWalletBalance(app.currentUser.id, assetUp, app.wallets[assetUp]);
        app.updateWalletDisplays();
        app.saveUserData();
        // Create subscription record
        const sub = {
            user_id: app.currentUser.id,
            plan_id: plan.id,
            plan_name: plan.name,
            amount_eur: amountEur,
            status: 'ACTIVE',
            start_date: new Date().toISOString(),
            duration_days: plan.duration_days,
            accrued_eur: 0
        };
        await app.apiCall('POST', 'subscriptions', sub);
        // Log transaction invest
        await app.apiCall('POST', 'transactions', {
            user_id: app.currentUser.id,
            type: 'invest',
            crypto: assetUp,
            amount: neededAsset,
            status: 'completed',
            created_at: new Date().toISOString()
        });
        alert('Souscription effectuée. Gains à venir quotidiennement.');
        app.loadSubscriptions();
    } catch (e) { alert('Erreur de souscription'); }
}

function updateProfile(event) {
    event.preventDefault();
    const name = document.getElementById('profile-name').value;
    const phone = document.getElementById('profile-phone').value;
    
    if (app.currentUser) {
        app.currentUser.full_name = name;
        app.currentUser.phone = phone;
        app.saveUserData();
        alert('Profil mis à jour avec succès!');
    }
}

async function markNotifRead(id) {
    try {
        const list = await app.apiCall('GET', `notifications?user_id=${app.currentUser.id}`);
        const n = Array.isArray(list)? list.find(x=>x.id===id) : null;
        if (!n) return;
        n.read = true; n.updated_at = new Date().toISOString();
        await app.apiCall('PUT', 'notifications', n);
        app.loadSupportTickets();
    } catch (e) { alert('Erreur'); }
}

function changePassword(event) {
    event.preventDefault();
    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    
    if (newPass !== confirm) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }
    
    if (newPass.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    // In real app, verify current password
    app.currentUser.password = newPass;
    app.saveUserData();
    alert('Mot de passe changé avec succès!');
    
    // Clear form
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function createSupportTicket(event) {
    event.preventDefault();
    const subject = document.getElementById('ticket-subject').value;
    const message = document.getElementById('ticket-message').value;
    
    if (!message.trim()) {
        alert('Veuillez saisir un message');
        return;
    }
    
    const ticket = {
        user_id: app.currentUser.id,
        subject: subject,
        message: message,
        status: 'open',
        created_at: new Date().toISOString()
    };
    
    app.apiCall('POST', 'support_tickets', ticket)
        .then(()=>{
            alert('Ticket créé avec succès!');
    document.getElementById('ticket-message').value = '';
    app.loadSupportTickets();
        })
        .catch(()=>{
            alert('Erreur création ticket');
        });
}

function exportTransactions() {
    // Export transactions to CSV
    const transactions = JSON.parse(localStorage.getItem('cryptoboost_transactions') || '[]');
    
    if (transactions.length === 0) {
        alert('Aucune transaction à exporter');
        return;
    }
    
    const csv = 'Date,Type,Crypto,Montant,Statut\n' + 
        transactions.map(tx => 
            `${new Date(tx.created_at).toLocaleDateString()},${tx.type},${tx.crypto},${tx.amount},${tx.status}`
        ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions_cryptoboost.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new CryptoBoostApp();

    // Initialize with session management
    app.initializeAppWithSessionCheck();
    // Public plans simulator
    const simBtn = document.getElementById('sim-calc');
    if (simBtn) {
        simBtn.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('sim-amount').value||'0');
            const duration = parseInt(document.getElementById('sim-duration').value||'0');
            const planSel = document.getElementById('sim-plan');
            const min = parseFloat(planSel.selectedOptions[0].dataset.min);
            const max = parseFloat(planSel.selectedOptions[0].dataset.max);
            if (!amount || !duration) {
                document.getElementById('sim-result').textContent = 'Veuillez saisir un montant et une durée.';
                return;
            }
            const avgRoiYear = (min+max)/2/100; // annual
            const daily = avgRoiYear/365;
            const gain = amount * daily * duration;
            document.getElementById('sim-result').textContent = `Estimation des gains: ${gain.toFixed(2)} € (ROI ~ ${(gain/amount*100).toFixed(2)}%)`;
        });
    }
    // Mobile menu toggle
    const btn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('mobileMenuClose');
    const menu = document.getElementById('mobileMenu');
    if (btn && menu) btn.addEventListener('click', ()=> toggleMobileMenu(true));
    if (closeBtn && menu) closeBtn.addEventListener('click', ()=> toggleMobileMenu(false));
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function toggleMobileMenu(open) {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    if (open) menu.classList.add('open'); else menu.classList.remove('open');
}