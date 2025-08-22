// Interface Utilities for CryptoBoost
class UIManager {
    constructor() {
        this.notificationQueue = [];
        this.isProcessingNotifications = false;
        this.loadingElements = new Set();
        
        // Configuration
        this.config = {
            notifications: {
                duration: 5000,
                maxVisible: 3,
                position: 'top-right'
            },
            animations: {
                duration: 300,
                easing: 'ease-in-out'
            }
        };
        
        this.init();
    }

    init() {
        // Create notification container
        this.createNotificationContainer();
        
        // Initialize loading indicator
        this.createLoadingIndicator();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize theme
        this.initializeTheme();
    }

    createNotificationContainer() {
        let container = document.querySelector('.notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notifications-container ' + this.config.notifications.position;
            document.body.appendChild(container);
        }
    }

    createLoadingIndicator() {
        let indicator = document.querySelector('.global-loading-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'global-loading-indicator hidden';
            indicator.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <div class="loading-text">Chargement...</div>
                </div>
            `;
            document.body.appendChild(indicator);
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
        });

        // Close buttons for notifications
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-close')) {
                const notification = e.target.closest('.notification');
                this.closeNotification(notification);
            }
        });
    }

    showNotification(message, type = 'info', duration = null) {
        const notification = {
            message,
            type,
            duration: duration || this.config.notifications.duration,
            id: 'notif-' + Date.now()
        };
        
        this.notificationQueue.push(notification);
        this.processNotificationQueue();
    }

    async processNotificationQueue() {
        if (this.isProcessingNotifications) return;
        this.isProcessingNotifications = true;

        const container = document.querySelector('.notifications-container');
        const currentNotifications = container.children.length;

        while (this.notificationQueue.length > 0 && 
               currentNotifications < this.config.notifications.maxVisible) {
            const notification = this.notificationQueue.shift();
            await this.displayNotification(notification);
        }

        this.isProcessingNotifications = false;
    }

    async displayNotification({ message, type, duration, id }) {
        const container = document.querySelector('.notifications-container');
        const notificationElement = document.createElement('div');
        
        notificationElement.className = `notification notification-${type} fade-in`;
        notificationElement.id = id;
        notificationElement.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
            <button class="notification-close">&times;</button>
        `;

        container.appendChild(notificationElement);

        // Setup auto-close
        setTimeout(() => {
            this.closeNotification(notificationElement);
        }, duration);

        return new Promise(resolve => {
            notificationElement.addEventListener('animationend', resolve, { once: true });
        });
    }

    closeNotification(notification) {
        if (!notification) return;
        
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            this.processNotificationQueue();
        }, this.config.animations.duration);
    }

    showLoading(elementId = null) {
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.add('loading');
                this.loadingElements.add(elementId);
            }
        } else {
            document.querySelector('.global-loading-indicator')?.classList.remove('hidden');
        }
    }

    hideLoading(elementId = null) {
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.remove('loading');
                this.loadingElements.delete(elementId);
            }
        } else {
            if (this.loadingElements.size === 0) {
                document.querySelector('.global-loading-indicator')?.classList.add('hidden');
            }
        }
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.classList.remove(currentTheme);
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.showNotification(`Thème ${newTheme} activé`, 'info', 2000);
    }

    initializeTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.add(theme);
    }
}

// Create global instance
window.ui = new UIManager();

// Export for module usage
export default UIManager;
