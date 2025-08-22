// CryptoBoost Authentication & Authorization System - Version 2.0

// Global Application Class
class CryptoBoostApp {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.sessionTimeout = 3600000; // 1 hour
        this.lastActivity = Date.now();
    }

    async showDashboard() {
        this.checkSession();
        if (!this.isAuthenticated) {
            throw new Error('User not authenticated');
        }
        return {
            user: this.currentUser,
            dashboardData: await this.getDashboardData()
        };
    }

    validateAuth(token) {
        if (!token) return false;
        try {
            const decoded = this.verifyToken(token);
            this.currentUser = decoded;
            this.isAuthenticated = true;
            this.lastActivity = Date.now();
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    getCurrentUser() {
        this.checkSession();
        return this.currentUser;
    }

    checkSession() {
        if (!this.isAuthenticated) return false;
        if (Date.now() - this.lastActivity > this.sessionTimeout) {
            this.logout();
            throw new Error('Session expired');
        }
        this.lastActivity = Date.now();
        return true;
    }

    async getDashboardData() {
        if (!this.currentUser) return null;
        try {
            return {
                lastLogin: this.currentUser.lastLogin,
                role: this.currentUser.role,
                permissions: this.currentUser.permissions,
                plan: this.currentUser.plan,
                activity: await this.getUserActivity()
            };
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            throw new Error('Failed to load dashboard data');
        }
    }

    async getUserActivity() {
        // Implémentation à venir
        return [];
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.lastActivity = null;
        localStorage.removeItem('auth_token');
    }

    verifyToken(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

// Instance globale de l'application
const app = new CryptoBoostApp();

// Configuration d'authentification
const AUTH_CONFIG = {
    tokenExpiration: 3600, // 1 heure
    maxLoginAttempts: 3,
    lockoutDuration: 900, // 15 minutes
    admins: [
        {
            email: 'admin@cryptoboost.com',
            passwordHash: 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
            name: 'Super Admin',
            role: 'admin',
            permissions: ['all'],
            id: 'admin-1'
        },
        {
            email: 'support@cryptoboost.com',
            passwordHash: '6d201beeefb589b08ef0672dac82353d0cbd9ad99e1642c83a1601f3d647bcca',
            name: 'Support Admin',
            role: 'support',
            permissions: ['support', 'read'],
            id: 'admin-2'
        }
    ]
};

// Gestionnaire d'authentification
async function authenticate(email, password) {
    const hashedPassword = await hashPassword(password);
    const user = AUTH_CONFIG.admins.find(admin => 
        admin.email === email && admin.passwordHash === hashedPassword
    );

    if (user) {
        const token = generateToken(user);
        app.validateAuth(token);
        return { token, user: { ...user, passwordHash: undefined } };
    }

    throw new Error('Invalid credentials');
}

// Utilitaires
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function generateToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + AUTH_CONFIG.tokenExpiration * 1000
    }));
    const signature = btoa('dummy-signature'); // En production, utiliser une vraie signature
    return `${header}.${payload}.${signature}`;
}

// Export des fonctionnalités
export {
    app as CryptoBoostApp,
    authenticate,
    AUTH_CONFIG
};
