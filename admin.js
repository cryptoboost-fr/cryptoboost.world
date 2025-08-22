// CryptoBoost Admin Dashboard JavaScript
class CryptoBoostAdmin {
    constructor() {
        this.currentAdmin = null;
        this.users = [];
        this.transactions = [];
        this.stats = {
            totalUsers: 2547,
            totalVolume: 1200000,
            totalTransactions: 15432,
            totalRevenue: 45230
        };
        this.init();
    }

    init() {
        this.loadAdminData();
        this.loadUsers();
        this.loadTransactions();
        this.updateStats();
        
        // Auto-refresh data every 30 seconds
        setInterval(() => {
            this.loadUsers();
            this.loadTransactions();
            this.updateStats();
        }, 30000);
    }

    // Authentication
    loadAdminData() {
        const saved = localStorage.getItem('cryptoboost_admin');
        if (saved) {
            this.currentAdmin = JSON.parse(saved);
        } else {
            // Default admin
            this.currentAdmin = {
                id: 'admin-default',
                email: 'admin@cryptoboost.com',
                role: 'admin',
                full_name: 'Admin Default'
            };
        }
    }

    logout() {
        localStorage.removeItem('cryptoboost_admin');
        window.location.href = 'index.html';
    }

    // Page Management
    showAdminPage(pageName) {
        // Hide all pages
        const pages = [
            'admin-dashboard-page',
            'admin-users-page', 
            'admin-transactions-page',
            'admin-investments-page',
            'admin-wallets-page',
            'admin-reports-page',
            'admin-settings-page'
        ];
        
        pages.forEach(page => {
            const element = document.getElementById(page);
            if (element) element.classList.add('hidden');
        });

        // Update nav buttons
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600');
            btn.classList.add('hover:bg-gray-700');
        });

        // Show selected page
        const targetPage = document.getElementById(`admin-${pageName}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Update active nav button
        const activeBtn = document.querySelector(`[onclick="showAdminPage('${pageName}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('hover:bg-gray-700');
            activeBtn.classList.add('bg-blue-600');
        }

        // Load page-specific data
        this.loadPageData(pageName);
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'users':
                this.loadUsersTable();
                break;
            case 'transactions':
                this.loadTransactionsTable();
                break;
            case 'investments':
                this.loadInvestmentsData();
                break;
            case 'wallets':
                this.loadWalletsData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    // Stats Management
    updateStats() {
        document.getElementById('total-users').textContent = this.stats.totalUsers.toLocaleString();
        document.getElementById('total-transactions').textContent = this.stats.totalTransactions.toLocaleString();
        
        // Update recent activity
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;
        const fmtTime = (ts) => {
            const d = new Date(ts); const diff = (Date.now()-d.getTime())/1000;
            if (diff<60) return `${Math.floor(diff)}s`;
            if (diff<3600) return `${Math.floor(diff/60)}min`;
            if (diff<86400) return `${Math.floor(diff/3600)}h`;
            return `${Math.floor(diff/86400)}j`;
        };
        Promise.all([
            fetch('/.netlify/functions/github-db?collection=transactions').then(r=>r.json()).catch(()=>[]),
            fetch('/.netlify/functions/github-db?collection=subscriptions').then(r=>r.json()).catch(()=>[]),
            fetch('/.netlify/functions/github-db?collection=plans').then(r=>r.json()).catch(()=>[]),
            fetch('/.netlify/functions/github-db?collection=support_tickets').then(r=>r.json()).catch(()=>[])
        ]).then(([txs, subs, plans, tickets])=>{
            const acts = [];
            (Array.isArray(txs)?txs:[]).forEach(t=>{
                acts.push({ ts: t.updated_at||t.created_at, color: t.status==='completed'?'green':(t.status==='pending'||t.status==='awaiting_admin'?'yellow':'red'), msg: `${t.type.toUpperCase()} ${t.crypto} • ${t.amount}` });
            });
            (Array.isArray(subs)?subs:[]).forEach(s=>{
                acts.push({ ts: s.updated_at||s.start_date, color: 'purple', msg: `Souscription ${s.plan_name} • ${s.amount_eur} € • ${s.status}` });
            });
            (Array.isArray(plans)?plans:[]).forEach(p=>{
                acts.push({ ts: p.updated_at||p.created_at, color: 'blue', msg: `Plan ${p.name} ${p.status==='inactive'?'désactivé':'mis à jour'}` });
            });
            (Array.isArray(tickets)?tickets:[]).forEach(k=>{
                acts.push({ ts: k.updated_at||k.created_at, color: 'red', msg: `Ticket: ${k.subject} • ${k.status}` });
            });
            acts.sort((a,b)=> new Date(b.ts) - new Date(a.ts));
            const top = acts.slice(0,10);
            container.innerHTML = top.length ? top.map(a=>`
                <div class=\"flex items-center justify-between p-3 bg-gray-700 rounded\">\n                    <div class=\"flex items-center\">\n                        <div class=\"w-2 h-2 bg-${a.color}-400 rounded-full mr-3\"></div>\n                        <span class=\"text-sm\">${a.msg}</span>\n                    </div>\n                    <span class=\"text-xs text-gray-400\">Il y a ${fmtTime(a.ts)}</span>\n                </div>
            `).join('') : '<p class="text-gray-400">Aucune activité récente</p>';
        }).catch(()=>{
            container.innerHTML = '<p class="text-gray-400">Aucune activité récente</p>';
        });
    }

    // Users Management
    async loadUsers() {
        try {
            const res = await fetch('/.netlify/functions/github-db?collection=users');
            const data = await res.json();
            this.users = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    loadUsersTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.users.map(user => {
            const initials = user.full_name.split(' ').map(n => n[0]).join('');
            const statusClass = user.status === 'active' ? 'status-active' : 
                               user.status === 'suspended' ? 'status-suspended' : 'status-pending';
            const statusText = user.status === 'active' ? 'Actif' : 
                              user.status === 'suspended' ? 'Suspendu' : 'En attente';

            return `
                <tr class="border-b border-gray-700">
                    <td class="py-3">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                <span class="text-sm font-bold">${initials}</span>
                            </div>
                            <span>${user.full_name}</span>
                        </div>
                    </td>
                    <td class="py-3">${user.email}</td>
                    <td class="py-3">${user.role === 'client' ? 'Client' : 'Admin'}</td>
                    <td class="py-3">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                    <td class="py-3">${new Date(user.created_at).toLocaleDateString()}</td>
                    <td class="py-3">
                        <button onclick="editUser('${user.id}')" class="text-blue-400 hover:text-blue-300 mr-2">Modifier</button>
                        <button onclick="toggleUserStatus('${user.id}')" class="text-red-400 hover:text-red-300">
                            ${user.status === 'active' ? 'Suspendre' : 'Activer'}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Transactions Management
    async loadTransactions() {
        try {
            const res = await fetch('/.netlify/functions/github-db?collection=transactions');
            const data = await res.json();
            this.transactions = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    loadTransactionsTable() {
        const tbody = document.getElementById('transactions-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.transactions.map(tx => {
            const statusClass = tx.status === 'completed' ? 'status-completed' : 
                               tx.status === 'failed' ? 'status-failed' : 'status-pending';
            const statusText = tx.status === 'completed' ? 'Complété' : 
                              tx.status === 'failed' ? 'Échoué' : 'En attente';
            const typeText = tx.type === 'deposit' ? 'Dépôt' : 
                            tx.type === 'withdraw' ? 'Retrait' : 
                            tx.type === 'exchange' ? 'Échange' : 'Investissement';

            return `
                <tr class="border-b border-gray-700">
                    <td class="py-3 font-mono text-sm">${tx.id || ''}</td>
                    <td class="py-3">${tx.user_name || tx.user_id || ''}</td>
                    <td class="py-3">${typeText}</td>
                    <td class="py-3">
                        <div>
                            <span class="font-bold">${tx.amount} ${tx.crypto}</span>
                            ${tx.usd_value ? `<div class=\"text-sm text-gray-400\">≈ €${tx.usd_value.toLocaleString()}</div>` : ''}
                        </div>
                    </td>
                    <td class="py-3">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                    <td class="py-3">${tx.created_at ? new Date(tx.created_at).toLocaleDateString() : ''}</td>
                    <td class="py-3">
                        ${tx.status === 'pending' ? 
                            `<button onclick=\"approveTransaction('${tx.id}')\" class=\"text-green-400 hover:text-green-300 mr-2\">Approuver</button>
                             <button onclick=\"rejectTransaction('${tx.id}')\" class=\"text-red-400 hover:text-red-300\">Rejeter</button>` : 
                         tx.status === 'awaiting_admin' ?
                            `<button onclick=\"approveTransaction('${tx.id}')\" class=\"text-green-400 hover:text-green-300 mr-2\">Approuver</button>
                             <button onclick=\"rejectTransaction('${tx.id}')\" class=\"text-red-400 hover:text-red-300 mr-2\">Rejeter</button>` :
                         tx.status === 'sent' ?
                            `<button onclick=\"completeWithdraw('${tx.id}')\" class=\"text-green-400 hover:text-green-300 mr-2\">Marquer Complété</button>
                             <button onclick=\"viewTransaction('${tx.id}')\" class=\"text-blue-400 hover:text-blue-300\">Voir</button>` :
                            `<button onclick=\"viewTransaction('${tx.id}')\" class=\"text-blue-400 hover:text-blue-300\">Voir</button>`
                        }
                    </td>
                </tr>
            `;
        }).join('');
    }

    // User Actions
    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        const m = document.getElementById('adminEditUserModal');
        if (!m) return;
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.full_name || '';
        document.getElementById('edit-user-email').value = user.email || '';
        document.getElementById('edit-user-role').value = user.role || 'client';
        document.getElementById('edit-user-status').value = user.status || 'active';
        document.getElementById('edit-user-phone').value = user.phone || '';
        m.classList.remove('hidden');
    }

    toggleUserStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            const newStatus = user.status === 'active' ? 'suspended' : 'active';
            const action = newStatus === 'suspended' ? 'suspendre' : 'activer';
            
            if (confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.full_name}?`)) {
                user.status = newStatus;
                fetch('/.netlify/functions/github-db?collection=users', {
                    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(user)
                }).then(()=>{
                this.loadUsersTable();
                alert(`Utilisateur ${newStatus === 'active' ? 'activé' : 'suspendu'} avec succès!`);
                }).catch(()=> alert('Erreur lors de la mise à jour du statut'));
            }
        }
    }

    // Transaction Actions
    viewTransaction(txId) {
        const tx = this.transactions.find(t => t.id === txId);
        if (!tx) return;
        const m = document.getElementById('adminTxDetail');
        if (!m) return;
        document.getElementById('txd-id').value = tx.id || '';
        document.getElementById('txd-user').value = tx.user_name || tx.user_id || '';
        document.getElementById('txd-type').value = tx.type || '';
        document.getElementById('txd-crypto').value = tx.crypto || '';
        document.getElementById('txd-amount').value = `${tx.amount} ${tx.crypto}`;
        document.getElementById('txd-status').value = tx.status || 'pending';
        document.getElementById('txd-hash').value = tx.tx_hash || '';
        document.getElementById('txd-reason').value = tx.reject_reason || '';
        m.classList.remove('hidden');
    }

    approveTransaction(txId) {
        const tx = this.transactions.find(t => t.id === txId);
        if (!tx) return;
        if (!confirm(`Approuver la transaction ${txId}${tx.user_name?` de ${tx.user_name}`:''}?`)) return;
        // Lifecycle: deposit -> completed (credit wallet); withdraw -> sent (awaiting completion)
        if (tx.type === 'deposit') {
            tx.status = 'completed';
            // Credit user wallet
            this.creditUserWallet(tx.user_id, tx.crypto, tx.amount);
        } else if (tx.type === 'withdraw') {
            const txHash = prompt('Entrez le txHash (facultatif pour sent):', tx.tx_hash || '');
            if (txHash) tx.tx_hash = txHash;
            tx.status = 'sent';
            // Debit user wallet at approval time
            this.debitUserWallet(tx.user_id, tx.crypto, tx.amount);
        } else {
            tx.status = 'completed';
        }
        tx.updated_at = new Date().toISOString();
        fetch('/.netlify/functions/github-db?collection=transactions', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tx)
        }).then(()=>{
            this.loadTransactions();
            this.loadTransactionsTable();
            alert('Transaction approuvée avec succès!');
        }).catch(()=> alert('Erreur lors de la mise à jour'));
    }

    creditUserWallet(userId, crypto, amount) {
        // Fetch existing wallet for user/crypto
        fetch(`/.netlify/functions/github-db?collection=wallets&user_id=${userId}`)
            .then(r=>r.json()).then(items=>{
                const list = Array.isArray(items) ? items : [];
                let w = list.find(x => x.crypto === crypto);
                if (w) {
                    w.balance = (w.balance || 0) + amount;
                    w.updated_at = new Date().toISOString();
                    return fetch('/.netlify/functions/github-db?collection=wallets', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(w)});
                } else {
                    const newW = { user_id: userId, crypto, balance: amount, updated_at: new Date().toISOString() };
                    return fetch('/.netlify/functions/github-db?collection=wallets', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newW)});
                }
            }).catch(()=>{});
    }

    debitUserWallet(userId, crypto, amount) {
        fetch(`/.netlify/functions/github-db?collection=wallets&user_id=${userId}`)
            .then(r=>r.json()).then(items=>{
                const list = Array.isArray(items) ? items : [];
                let w = list.find(x => x.crypto === crypto);
                if (w) {
                    w.balance = Math.max(0, (w.balance || 0) - amount);
                    w.updated_at = new Date().toISOString();
                    return fetch('/.netlify/functions/github-db?collection=wallets', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(w)});
                }
            }).catch(()=>{});
    }

    completeWithdraw(txId) {
        const tx = this.transactions.find(t => t.id === txId);
        if (!tx) return;
        if (tx.type !== 'withdraw') return;
        const txHash = prompt('Confirmer txHash (optionnel) :', tx.tx_hash || '');
        if (txHash) tx.tx_hash = txHash;
        tx.status = 'completed';
        tx.updated_at = new Date().toISOString();
        fetch('/.netlify/functions/github-db?collection=transactions', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tx)
        }).then(()=>{
            this.loadTransactions();
            this.loadTransactionsTable();
            alert('Retrait marqué comme complété.');
        }).catch(()=> alert('Erreur lors de la mise à jour'));
    }

    rejectTransaction(txId) {
        const tx = this.transactions.find(t => t.id === txId);
        if (!tx) return;
        const reason = prompt('Raison du rejet:');
        if (!reason) return;
        tx.status = 'rejected';
        tx.reject_reason = reason;
        tx.updated_at = new Date().toISOString();
        fetch('/.netlify/functions/github-db?collection=transactions', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tx)
        }).then(()=>{
            this.loadTransactions();
            this.loadTransactionsTable();
            alert('Transaction rejetée.');
        }).catch(()=> alert('Erreur lors de la mise à jour'));
    }

    // Investments: CRUD plans
    async loadInvestmentsData() {
        try {
            const res = await fetch('/.netlify/functions/github-db?collection=plans');
            const plans = await res.json();
            const list = Array.isArray(plans) ? plans : [];
            const el = document.getElementById('plans-list');
            if (el) {
                el.innerHTML = list.map(p => `
                    <div class="p-4 bg-gray-700 rounded">
                        <div class="flex items-start justify-between">
                            <div>
                                <div class="font-bold">${p.name} <span class="text-sm text-gray-300">(${p.duration_days}j • ${p.roi_min}%–${p.roi_max}%)</span></div>
                                <div class="text-sm text-gray-300">Min ${p.min_eur} € • Max ${p.max_eur} € • ${p.status || 'active'} • Ref: ${p.ref_asset || 'EUR'}</div>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="showEditPlan('${p.id}')" class="text-blue-400 hover:text-blue-300">Modifier</button>
                                <button onclick="togglePlan('${p.id}')" class="text-yellow-400 hover:text-yellow-300">${p.status==='inactive'?'Activer':'Désactiver'}</button>
                                <button onclick="deletePlan('${p.id}')" class="text-red-400 hover:text-red-300">Supprimer</button>
                            </div>
                        </div>
                        <div id="plan-edit-${p.id}" class="mt-3 hidden">
                            <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                                <input id="plan-name-${p.id}" class="px-3 py-2 bg-gray-800 rounded" placeholder="Nom" value="${p.name}">
                                <input id="plan-roi-min-${p.id}" type="number" step="0.1" class="px-3 py-2 bg-gray-800 rounded" placeholder="ROI min %" value="${p.roi_min}">
                                <input id="plan-roi-max-${p.id}" type="number" step="0.1" class="px-3 py-2 bg-gray-800 rounded" placeholder="ROI max %" value="${p.roi_max}">
                                <input id="plan-min-eur-${p.id}" type="number" class="px-3 py-2 bg-gray-800 rounded" placeholder="Min €" value="${p.min_eur}">
                                <input id="plan-max-eur-${p.id}" type="number" class="px-3 py-2 bg-gray-800 rounded" placeholder="Max €" value="${p.max_eur}">
                                <select id="plan-ref-asset-${p.id}" class="px-3 py-2 bg-gray-800 rounded">
                                    ${['EUR','USDT','BTC','ETH','USDC'].map(a=>`<option value="${a}" ${ (p.ref_asset||'EUR')===a?'selected':''}>${a}</option>`).join('')}
                                </select>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 items-center">
                                <input id="plan-duration-${p.id}" type="number" class="px-3 py-2 bg-gray-800 rounded" placeholder="Durée (jours)" value="${p.duration_days}">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm">Activé</span>
                                    <input id="plan-status-${p.id}" type="checkbox" ${p.status!=='inactive'?'checked':''}>
                                </div>
                                <button onclick="savePlan('${p.id}')" class="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">Enregistrer</button>
                                <button onclick="cancelEditPlan('${p.id}')" class="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded">Annuler</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            // Populate subscriptions list and filters
            const planFilter = document.getElementById('sub-plan-filter');
            if (planFilter) {
                planFilter.innerHTML = '<option value="">Tous les plans</option>' + list.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
            }
            this.loadAdminSubscriptions();
        } catch(e) { console.error(e); }
    }

    async loadAdminSubscriptions() {
        try {
            const res = await fetch('/.netlify/functions/github-db?collection=subscriptions');
            let subs = await res.json();
            subs = Array.isArray(subs) ? subs : [];
            const planFilter = document.getElementById('sub-plan-filter');
            const statusFilter = document.getElementById('sub-status-filter');
            const planVal = planFilter ? planFilter.value : '';
            const statusVal = statusFilter ? statusFilter.value : '';
            const filtered = subs.filter(s => (!planVal || s.plan_id===planVal) && (!statusVal || s.status===statusVal));
            const box = document.getElementById('subs-admin-list');
            if (!box) return;
            box.innerHTML = filtered.map(s=>`
                <div class=\"p-3 bg-gray-700 rounded flex items-center justify-between\">
                    <div>
                        <div class=\"font-medium\">${s.plan_name} • ${s.duration_days}j</div>
                        <div class=\"text-sm text-gray-300\">User: ${s.user_id} • Investi: ${s.amount_eur?.toFixed? s.amount_eur.toFixed(2): s.amount_eur} € • Gains: ${(s.accrued_eur||0).toFixed(2)} €</div>
                    </div>
                    <div class=\"flex gap-3\">
                        ${s.status==='ACTIVE' ? `<button onclick=\"closeSubscription('${s.id}')\" class=\"text-red-400 hover:text-red-300\">Clôturer</button>` : ''}
                    </div>
                </div>
            `).join('');
            if (planFilter && !planFilter.__bound) {
                planFilter.addEventListener('change', ()=> this.loadAdminSubscriptions());
                planFilter.__bound = true;
            }
            if (statusFilter && !statusFilter.__bound) {
                statusFilter.addEventListener('change', ()=> this.loadAdminSubscriptions());
                statusFilter.__bound = true;
            }
        } catch(e) { console.error(e); }
    }

    async closeSubscription(subId) {
        try {
            const subs = await (await fetch('/.netlify/functions/github-db?collection=subscriptions')).json();
            const s = Array.isArray(subs) ? subs.find(x=>x.id===subId) : null;
            if (!s) return;
            if (!confirm('Clôturer cette souscription ?')) return;
            s.status = 'CLOSED'; s.closed_at = new Date().toISOString();
            await fetch('/.netlify/functions/github-db?collection=subscriptions', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(s)});
            this.loadAdminSubscriptions();
        } catch(e) { alert('Erreur clôture'); }
    }

    async createPlan() {
        const name = document.getElementById('plan-name').value.trim();
        const roiMin = parseFloat(document.getElementById('plan-roi-min').value||'0');
        const roiMax = parseFloat(document.getElementById('plan-roi-max').value||'0');
        const minEur = parseFloat(document.getElementById('plan-min-eur').value||'0');
        const maxEur = parseFloat(document.getElementById('plan-max-eur').value||'0');
        const duration = parseInt(document.getElementById('plan-duration').value||'0');
        const refAsset = document.getElementById('plan-ref-asset').value || 'EUR';
        if (!name || !duration || !roiMax || !minEur) { alert('Champs requis manquants'); return; }
        const body = { name, roi_min: roiMin, roi_max: roiMax, min_eur: minEur, max_eur: maxEur, duration_days: duration, ref_asset: refAsset, status: 'active' };
        await fetch('/.netlify/functions/github-db?collection=plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        alert('Plan créé');
        this.loadInvestmentsData();
    }

    async editPlan(id) {
        const plan = (await (await fetch('/.netlify/functions/github-db?collection=plans')).json()).find(p=>p.id===id);
        if (!plan) return;
        this.showEditPlan(id);
    }

    showEditPlan(id) {
        const el = document.getElementById(`plan-edit-${id}`);
        if (!el) return;
        el.classList.toggle('hidden');
    }

    async savePlan(id) {
        try {
            const plans = await (await fetch('/.netlify/functions/github-db?collection=plans')).json();
            const p = Array.isArray(plans)?plans.find(x=>x.id===id):null;
            if (!p) return;
            const val = (sel)=> document.getElementById(`${sel}-${id}`);
            const name = val('plan-name').value.trim();
            const roiMin = parseFloat(val('plan-roi-min').value||'0');
            const roiMax = parseFloat(val('plan-roi-max').value||'0');
            const minEur = parseFloat(val('plan-min-eur').value||'0');
            const maxEur = parseFloat(val('plan-max-eur').value||'0');
            const duration_days = parseInt(val('plan-duration').value||'0');
            const ref_asset = document.getElementById(`plan-ref-asset-${id}`).value || 'EUR';
            const statusChecked = document.getElementById(`plan-status-${id}`).checked;
            if (!name || duration_days<=0) { alert('Nom et durée requis'); return; }
            if (roiMin>roiMax) { alert('ROI min doit être ≤ ROI max'); return; }
            if (minEur>maxEur) { alert('Min € doit être ≤ Max €'); return; }
            p.name = name; p.roi_min = roiMin; p.roi_max = roiMax; p.min_eur = minEur; p.max_eur = maxEur; p.duration_days = duration_days; p.ref_asset = ref_asset; p.status = statusChecked ? 'active' : 'inactive';
            await fetch('/.netlify/functions/github-db?collection=plans', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p)});
            this.loadInvestmentsData();
        } catch(e) { alert('Erreur sauvegarde'); }
    }

    cancelEditPlan(id) {
        const el = document.getElementById(`plan-edit-${id}`);
        if (el) el.classList.add('hidden');
    }

    async togglePlan(id) {
        const plans = await (await fetch('/.netlify/functions/github-db?collection=plans')).json();
        const p = Array.isArray(plans) ? plans.find(x=>x.id===id) : null;
        if (!p) return;
        p.status = p.status === 'inactive' ? 'active' : 'inactive';
        await fetch('/.netlify/functions/github-db?collection=plans', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
        this.loadInvestmentsData();
    }

    async deletePlan(id) {
        if (!confirm('Supprimer ce plan ?')) return;
        await fetch(`/.netlify/functions/github-db?collection=plans&id=${id}`, { method: 'DELETE' });
        this.loadInvestmentsData();
    }

    async processAccruals() {
        if (!confirm('Traiter les gains quotidiens pour toutes les souscriptions actives ?')) return;
        try {
            const subs = await (await fetch('/.netlify/functions/github-db?collection=subscriptions')).json();
            const plans = await (await fetch('/.netlify/functions/github-db?collection=plans')).json();
            const byId = new Map((Array.isArray(plans)?plans:[]).map(p=>[p.id,p]));
            const activeSubs = (Array.isArray(subs)?subs:[]).filter(s=>s.status==='ACTIVE');
            for (const s of activeSubs) {
                const p = byId.get(s.plan_id); if (!p) continue;
                const dailyRoi = ((p.roi_min + p.roi_max)/2) / 100 / 30; // approx mensuel -> quotidien simplifié
                const gain = s.amount_eur * dailyRoi;
                s.accrued_eur = (s.accrued_eur || 0) + gain;
                s.updated_at = new Date().toISOString();
                await fetch('/.netlify/functions/github-db?collection=subscriptions', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(s)});
            }
            alert('Gains quotidiens traités');
        } catch(e) { alert('Erreur accrual'); }
    }

    loadWalletsData() {
        const ids = { BTC: 'agg-btc', ETH: 'agg-eth', USDT: 'agg-usdt', USDC: 'agg-usdc' };
        const eurIds = { BTC: 'agg-btc-eur', ETH: 'agg-eth-eur', USDT: 'agg-usdt-eur', USDC: 'agg-usdc-eur' };
        fetch('/.netlify/functions/github-db?collection=wallets')
            .then(r=>r.json())
            .then(items=>{
                const arr = Array.isArray(items)?items:[];
                const agg = { BTC:0, ETH:0, USDT:0, USDC:0 };
                arr.forEach(w=>{ if (agg[w.crypto]!=null) agg[w.crypto]+= (w.balance||0); });
                // get rates EUR from client global if available
                const rates = (window.cryptoAPI && window.cryptoAPI.getFallbackRates)? window.cryptoAPI.getFallbackRates() : { BTC:{price:0}, ETH:{price:0}, USDT:{price:1}, USDC:{price:1} };
                Object.keys(agg).forEach(sym=>{
                    const el = document.getElementById(ids[sym]);
                    const eel = document.getElementById(eurIds[sym]);
                    if (el) el.textContent = `${agg[sym].toFixed(sym==='BTC'||sym==='ETH'?8:2)} ${sym}`;
                    if (eel) eel.textContent = `≈ ${(agg[sym]*(rates[sym]?.price||0)).toFixed(2)} €`;
                });
                // recent activity: derive from transactions
                return fetch('/.netlify/functions/github-db?collection=transactions');
            })
            .then(r=>r.json())
            .then(txs=>{
                const box = document.getElementById('wallet-activity');
                if (!box) return;
                const arr = Array.isArray(txs)?txs.slice(-10).reverse():[];
                box.innerHTML = arr.length? arr.map(t=>`<div class=\"flex justify-between text-sm\"><span>${t.type.toUpperCase()} ${t.crypto}</span><span>${t.amount}</span><span>${new Date(t.created_at).toLocaleDateString()}</span></div>`).join('') : '<p class="text-gray-400">Aucune activité</p>';
            })
            .catch(()=>{
                // leave placeholders
            });
    }

    loadReportsData() {
        console.log('Loading reports data...');
    }

    loadSettingsData() {
        fetch('/.netlify/functions/github-db?collection=settings').then(r=>r.json()).then(data=>{
            const s = Array.isArray(data)? data.find(x=>x.id==='app-settings') : (data && data.id==='app-settings'? data : null);
            if (!s) return;
            const get = (id)=> document.getElementById(id);
            if (get('set-exchange-fee')) get('set-exchange-fee').value = s.exchange_fee_pct || 0.2;
            if (get('set-fee-btc')) get('set-fee-btc').value = s.fees?.BTC ?? 0.0002;
            if (get('set-fee-eth')) get('set-fee-eth').value = s.fees?.ETH ?? 0.003;
            if (get('set-fee-usdt')) get('set-fee-usdt').value = s.fees?.USDT ?? 2;
            if (get('set-fee-usdc')) get('set-fee-usdc').value = s.fees?.USDC ?? 2;
            if (get('set-addr-btc')) get('set-addr-btc').value = s.master_addresses?.BTC || '';
            if (get('set-addr-eth')) get('set-addr-eth').value = s.master_addresses?.ETH || '';
            if (get('set-addr-usdt')) get('set-addr-usdt').value = s.master_addresses?.USDT || '';
            if (get('set-addr-usdc')) get('set-addr-usdc').value = s.master_addresses?.USDC || '';
        }).catch(()=>{});
    }

    showAddUserModal() {
        alert('Modal d\'ajout d\'utilisateur à implémenter');
    }
}

// Global functions for HTML onclick events
let adminApp;

function showAdminPage(pageName) {
    adminApp.showAdminPage(pageName);
}

function logout() {
    adminApp.logout();
}

function editUser(userId) {
    adminApp.editUser(userId);
}

function toggleUserStatus(userId) {
    adminApp.toggleUserStatus(userId);
}

function viewTransaction(txId) {
    adminApp.viewTransaction(txId);
}

function approveTransaction(txId) {
    adminApp.approveTransaction(txId);
}

function closeEditUser() {
    document.getElementById('adminEditUserModal').classList.add('hidden');
}

function saveUserEdit() {
    const id = document.getElementById('edit-user-id').value;
    const full_name = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const role = document.getElementById('edit-user-role').value;
    const status = document.getElementById('edit-user-status').value;
    const phone = document.getElementById('edit-user-phone').value;
    const u = { id, full_name, email, role, status, phone };
    fetch('/.netlify/functions/github-db?collection=users', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(u) })
        .then(()=> { alert('Utilisateur mis à jour'); document.getElementById('adminEditUserModal').classList.add('hidden'); })
        .catch(()=> alert('Erreur mise à jour'));
}

function closeTxDetail() { document.getElementById('adminTxDetail').classList.add('hidden'); }
function saveTxDetail() {
    const id = document.getElementById('txd-id').value;
    const status = document.getElementById('txd-status').value;
    const tx_hash = document.getElementById('txd-hash').value;
    const reject_reason = document.getElementById('txd-reason').value;
    // Load existing
    fetch('/.netlify/functions/github-db?collection=transactions').then(r=>r.json()).then(list=>{
        const tx = (Array.isArray(list)?list:[]).find(t=>t.id===id);
        if (!tx) return alert('Transaction introuvable');
        tx.status = status; tx.tx_hash = tx_hash; tx.reject_reason = reject_reason; tx.updated_at = new Date().toISOString();
        return fetch('/.netlify/functions/github-db?collection=transactions', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(tx) })
            .then(()=>{ alert('Transaction mise à jour'); document.getElementById('adminTxDetail').classList.add('hidden'); });
    }).catch(()=> alert('Erreur mise à jour'));
}

function exportUsersCSV() { exportCSV('/.netlify/functions/github-db?collection=users', 'users.csv', (u)=> `${u.id},${u.email},${u.full_name||''},${u.role},${u.status}`); }
function exportTransactionsCSV() { exportCSV('/.netlify/functions/github-db?collection=transactions', 'transactions.csv', (t)=> `${t.id},${t.user_id},${t.type},${t.crypto},${t.amount},${t.status},${t.created_at}`); }
function exportSubscriptionsCSV() { exportCSV('/.netlify/functions/github-db?collection=subscriptions', 'subscriptions.csv', (s)=> `${s.id},${s.user_id},${s.plan_id},${s.amount_eur},${s.status},${s.start_date},${s.accrued_eur||0}`); }
function exportCSV(url, filename, mapFn) {
    fetch(url).then(r=>r.json()).then(data=>{
        const rows = Array.isArray(data)?data:[];
        const csv = rows.map(mapFn).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); URL.revokeObjectURL(link.href);
    }).catch(()=> alert('Erreur export'));
}

function saveSettings() {
    const settings = {
        id: 'app-settings',
        exchange_fee_pct: parseFloat(document.getElementById('set-exchange-fee').value||'0.2'),
        fees: {
            BTC: parseFloat(document.getElementById('set-fee-btc').value||'0.0002'),
            ETH: parseFloat(document.getElementById('set-fee-eth').value||'0.003'),
            USDT: parseFloat(document.getElementById('set-fee-usdt').value||'2'),
            USDC: parseFloat(document.getElementById('set-fee-usdc').value||'2')
        },
        master_addresses: {
            BTC: document.getElementById('set-addr-btc').value||'',
            ETH: document.getElementById('set-addr-eth').value||'',
            USDT: document.getElementById('set-addr-usdt').value||'',
            USDC: document.getElementById('set-addr-usdc').value||''
        }
    };
    fetch('/.netlify/functions/github-db?collection=settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(settings) })
        .then(()=> alert('Paramètres enregistrés'))
        .catch(()=> alert('Erreur enregistrement paramètres'));
}

function testFunctions() {
    const status = document.getElementById('functions-status');
    const ok = (name)=> `<span class=\"text-green-400\">${name}: OK</span>`;
    const ko = (name)=> `<span class=\"text-red-400\">${name}: ERREUR</span>`;
    Promise.all([
        fetch('/.netlify/functions/github-db?collection=__health').then(()=>true).catch(()=>false),
        fetch('/.netlify/functions/coinapi?action=rates').then(r=>r.ok).catch(()=>false)
    ]).then(([dbOk, coinOk])=>{
        status.innerHTML = `${dbOk?ok('DB'):ko('DB')} | ${coinOk?ok('CoinAPI'):ko('CoinAPI')}`;
        setTimeout(()=>{ status.textContent=''; }, 6000);
    }).catch(()=>{ status.textContent = 'Erreur test fonctions'; });
}

function rejectTransaction(txId) {
    adminApp.rejectTransaction(txId);
}

function showAddUserModal() {
    adminApp.showAddUserModal();
}

// Investments globals
function createPlan() { adminApp.createPlan(); }
function editPlan(id) { adminApp.editPlan(id); }
function togglePlan(id) { adminApp.togglePlan(id); }
function deletePlan(id) { adminApp.deletePlan(id); }
function closeSubscription(id) { adminApp.closeSubscription(id); }
function processAccruals() { adminApp.processAccruals(); }
function showEditPlan(id) { adminApp.showEditPlan(id); }
function savePlan(id) { adminApp.savePlan(id); }
function cancelEditPlan(id) { adminApp.cancelEditPlan(id); }

// Initialize admin app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    adminApp = new CryptoBoostAdmin();
});
