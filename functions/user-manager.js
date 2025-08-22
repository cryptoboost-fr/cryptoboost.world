// Gestionnaire des utilisateurs pour CryptoBoost
class UserManager {
    constructor() {
        this.currentUser = null;
        this.userCache = new Map();
        this.init();
    }

    async init() {
        // Charger l'utilisateur courant depuis le localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                await this.validateSession();
            } catch (error) {
                console.error('Error initializing UserManager:', error);
                this.logout();
            }
        }
    }

    async register(userData) {
        try {
            // Validation des données
            if (!this.validateUserData(userData)) {
                throw new Error('Données utilisateur invalides');
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (data.success) {
                // Création des wallets initiaux
                await this.createInitialWallets(data.user.id);
                
                // Envoi de l'email de confirmation
                await this.sendConfirmationEmail(userData.email);
                
                return {
                    success: true,
                    user: data.user
                };
            }
            
            throw new Error(data.message || 'Erreur lors de l\'inscription');
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    validateUserData(userData) {
        const { fullname, email, phone, password } = userData;
        
        // Validation du nom
        if (!fullname || fullname.length < 2) {
            throw new Error('Le nom doit contenir au moins 2 caractères');
        }
        
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error('Email invalide');
        }
        
        // Validation du téléphone
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (phone && !phoneRegex.test(phone)) {
            throw new Error('Numéro de téléphone invalide');
        }
        
        // Validation du mot de passe
        if (!password || password.length < 8) {
            throw new Error('Le mot de passe doit contenir au moins 8 caractères');
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
        }

        return true;
    }

    async createInitialWallets(userId) {
        try {
            const currencies = ['BTC', 'ETH', 'USDT', 'USDC'];
            const walletPromises = currencies.map(currency => 
                fetch('/api/wallets/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        currency,
                        balance: 0
                    })
                })
            );

            await Promise.all(walletPromises);
            return true;
        } catch (error) {
            console.error('Error creating wallets:', error);
            return false;
        }
    }

    async sendConfirmationEmail(email) {
        try {
            const response = await fetch('/api/auth/send-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            return false;
        }
    }

    async validateSession() {
        try {
            const response = await fetch('/api/auth/validate-session', {
                headers: {
                    'Authorization': `Bearer ${this.currentUser?.token}`
                }
            });

            const data = await response.json();
            
            if (!data.valid) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Session validation error:', error);
            this.logout();
            return false;
        }
    }

    updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error('Aucun utilisateur connecté');
        }

        return fetch('/api/users/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.currentUser.token}`
            },
            body: JSON.stringify(updates)
        }).then(response => response.json());
    }

    async getUserWallets() {
        if (!this.currentUser) {
            throw new Error('Aucun utilisateur connecté');
        }

        try {
            const response = await fetch('/api/wallets/user', {
                headers: {
                    'Authorization': `Bearer ${this.currentUser.token}`
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching wallets:', error);
            throw error;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = '/login.html';
    }
}

// Create global instance
window.userManager = new UserManager();

// Export for module usage
export default UserManager;
