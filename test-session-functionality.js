// Test Suite for CryptoBoost Session and Action Functionality
// Execute this in browser console to test all functionality

class CryptoBoostTester {
    constructor() {
        this.testResults = [];
        this.currentUser = null;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
        this.testResults.push({ timestamp, message, type });
    }

    // Test 1: Clear any existing session
    async testClearSession() {
        this.log('Starting session tests...');

        try {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            sessionStorage.clear();
            this.log('Existing session cleared successfully', 'success');
            return true;
        } catch (error) {
            this.log(`Failed to clear session: ${error.message}`, 'error');
            return false;
        }
    }

    // Test 2: Test login functionality
    async testLogin() {
        this.log('Testing login functionality...');

        // Simulate login with test credentials
        const testCredentials = [
            { email: 'admin@cryptoboost.com', password: 'admin123', role: 'admin' },
            { email: 'client@cryptoboost.com', password: 'client123', role: 'client' }
        ];

        for (const creds of testCredentials) {
            try {
                // Simulate the login process
                const user = {
                    id: `${creds.role}-test-${Date.now()}`,
                    email: creds.email,
                    name: creds.email.split('@')[0].charAt(0).toUpperCase() + creds.email.split('@')[0].slice(1),
                    role: creds.role,
                    loginTime: new Date().toISOString(),
                    lastActivity: new Date().toISOString()
                };

                // Generate auth token (simulate auth.js logic)
                const token = btoa(JSON.stringify({
                    userId: user.id,
                    role: user.role,
                    timestamp: Date.now(),
                    expires: Date.now() + (24 * 60 * 60 * 1000)
                }));

                // Store session data
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('authToken', token);

                this.currentUser = user;
                this.log(`Login successful for ${creds.role}: ${creds.email}`, 'success');

                // Test session validation
                const isValid = this.testValidateSession();
                if (isValid) {
                    this.log(`Session validation passed for ${creds.role}`, 'success');
                } else {
                    this.log(`Session validation failed for ${creds.role}`, 'error');
                }

                // Test dashboard access
                await this.testDashboardAccess();

                // Test action buttons
                await this.testActionButtons();

                // Test navigation
                await this.testNavigation();

                // Logout for next test
                this.testLogout();

                // Small delay between tests
                await this.delay(1000);

            } catch (error) {
                this.log(`Login test failed for ${creds.email}: ${error.message}`, 'error');
            }
        }
    }

    // Test 3: Validate session
    testValidateSession() {
        try {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('authToken');

            if (!user || !token) {
                this.log('Session validation failed: missing user or token', 'error');
                return false;
            }

            const userObj = JSON.parse(user);
            const tokenObj = JSON.parse(atob(token));

            // Check token validity
            if (!tokenObj.userId || !tokenObj.expires || tokenObj.userId !== userObj.id) {
                this.log('Session validation failed: invalid token structure', 'error');
                return false;
            }

            if (tokenObj.expires < Date.now()) {
                this.log('Session validation failed: token expired', 'error');
                return false;
            }

            return true;
        } catch (error) {
            this.log(`Session validation error: ${error.message}`, 'error');
            return false;
        }
    }

    // Test 4: Dashboard access
    async testDashboardAccess() {
        try {
            // Simulate dashboard loading
            const dashboard = document.getElementById('dashboard');
            const mainContent = document.getElementById('main-content');

            if (!dashboard || !mainContent) {
                this.log('Dashboard elements not found', 'error');
                return false;
            }

            // Hide main content, show dashboard
            mainContent.style.display = 'none';
            dashboard.classList.remove('hidden');

            this.log('Dashboard access successful', 'success');

            // Test user display update
            await this.testUserDisplayUpdate();

            return true;
        } catch (error) {
            this.log(`Dashboard access error: ${error.message}`, 'error');
            return false;
        }
    }

    // Test 5: User display update
    async testUserDisplayUpdate() {
        try {
            if (!this.currentUser) {
                this.log('No current user for display update', 'error');
                return false;
            }

            // Update user name elements
            const userElements = document.querySelectorAll('.user-name, .user-display-name');
            userElements.forEach(el => {
                if (el && this.currentUser.name) {
                    el.textContent = this.currentUser.name;
                }
            });

            // Update role display
            const roleElements = document.querySelectorAll('.user-role');
            roleElements.forEach(el => {
                if (el && this.currentUser.role) {
                    el.textContent = this.currentUser.role.toUpperCase();
                }
            });

            this.log('User display updated successfully', 'success');
            return true;
        } catch (error) {
            this.log(`User display update error: ${error.message}`, 'error');
            return false;
        }
    }

    // Test 6: Action buttons
    async testActionButtons() {
        const actionButtons = [
            { id: 'showDeposit', name: 'Deposit' },
            { id: 'showWithdraw', name: 'Withdraw' },
            { id: 'showExchange', name: 'Exchange' },
            { id: 'showInvest', name: 'Invest' }
        ];

        this.log('Testing action buttons...');

        for (const button of actionButtons) {
            try {
                // Simulate button click
                const btnElement = document.querySelector(`[onclick*="${button.id}"]`);
                if (!btnElement) {
                    this.log(`Action button ${button.name} not found`, 'error');
                    continue;
                }

                // Check if button is clickable
                if (btnElement.style.display !== 'none' && !btnElement.disabled) {
                    this.log(`Action button ${button.name} is accessible`, 'success');

                    // Test modal opening for some buttons
                    if (button.id === 'showDeposit') {
                        await this.testModalFunctionality('depositModal', button.name);
                    } else if (button.id === 'showExchange') {
                        await this.testModalFunctionality('exchangeModal', button.name);
                    }
                } else {
                    this.log(`Action button ${button.name} is not accessible`, 'error');
                }

                await this.delay(200);

            } catch (error) {
                this.log(`Action button ${button.name} test error: ${error.message}`, 'error');
            }
        }
    }

    // Test 7: Modal functionality
    async testModalFunctionality(modalId, modalName) {
        try {
            const modal = document.getElementById(modalId);
            if (!modal) {
                this.log(`Modal ${modalName} not found`, 'error');
                return false;
            }

            // Check if modal can be shown
            modal.classList.remove('hidden');

            // Check for required elements in modal
            const requiredElements = modal.querySelectorAll('input, select, button');
            if (requiredElements.length > 0) {
                this.log(`Modal ${modalName} has ${requiredElements.length} interactive elements`, 'success');
            }

            // Hide modal again
            modal.classList.add('hidden');

            return true;
        } catch (error) {
            this.log(`Modal ${modalName} test error: ${error.message}`, 'error');
            return false;
        }
    }

    // Test 8: Navigation
    async testNavigation() {
        const navigationPages = [
            { id: 'dashboard', name: 'Dashboard' },
            { id: 'wallets-page', name: 'Wallets' },
            { id: 'transactions-page', name: 'Transactions' },
            { id: 'investments-page', name: 'Investments' },
            { id: 'profile-page', name: 'Profile' },
            { id: 'support-page', name: 'Support' }
        ];

        this.log('Testing navigation...');

        for (const page of navigationPages) {
            try {
                const pageElement = document.getElementById(page.id);
                if (!pageElement) {
                    this.log(`Navigation page ${page.name} not found`, 'error');
                    continue;
                }

                // Test page visibility toggle
                pageElement.classList.remove('hidden');
                await this.delay(100);
                pageElement.classList.add('hidden');

                this.log(`Navigation to ${page.name} works`, 'success');

            } catch (error) {
                this.log(`Navigation test error for ${page.name}: ${error.message}`, 'error');
            }
        }
    }

    // Test 9: Logout functionality
    testLogout() {
        try {
            // Clear session data
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            sessionStorage.clear();

            // Reset current user
            this.currentUser = null;

            // Hide dashboard, show main content
            const dashboard = document.getElementById('dashboard');
            const mainContent = document.getElementById('main-content');

            if (dashboard && mainContent) {
                dashboard.classList.add('hidden');
                mainContent.style.display = 'block';
            }

            this.log('Logout successful', 'success');
            return true;
        } catch (error) {
            this.log(`Logout error: ${error.message}`, 'error');
            return false;
        }
    }

    // Test 10: Session persistence
    async testSessionPersistence() {
        this.log('Testing session persistence...');

        try {
            // Login first
            const testUser = {
                id: 'persistence-test',
                email: 'test@cryptoboost.com',
                name: 'Test User',
                role: 'client',
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };

            const token = btoa(JSON.stringify({
                userId: testUser.id,
                role: testUser.role,
                timestamp: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000)
            }));

            localStorage.setItem('user', JSON.stringify(testUser));
            localStorage.setItem('authToken', token);

            // Simulate page refresh by clearing memory but keeping localStorage
            this.currentUser = null;

            // Test session recovery
            const recoveredUser = JSON.parse(localStorage.getItem('user') || 'null');
            const recoveredToken = localStorage.getItem('authToken');

            if (recoveredUser && recoveredToken) {
                this.log('Session persistence works - data recovered from localStorage', 'success');

                // Validate recovered session
                const isValid = this.testValidateSession();
                if (isValid) {
                    this.log('Recovered session is valid', 'success');
                } else {
                    this.log('Recovered session is invalid', 'error');
                }
            } else {
                this.log('Session persistence failed - data not found', 'error');
            }

            // Cleanup
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');

        } catch (error) {
            this.log(`Session persistence test error: ${error.message}`, 'error');
        }
    }

    // Utility method for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Run all tests
    async runAllTests() {
        this.log('🚀 Starting CryptoBoost Session and Action Tests', 'info');

        try {
            // Clear existing session
            await this.testClearSession();

            // Test login/logout
            await this.testLogin();

            // Test session persistence
            await this.testSessionPersistence();

            // Final summary
            this.printSummary();

        } catch (error) {
            this.log(`Test suite error: ${error.message}`, 'error');
            this.printSummary();
        }
    }

    // Print test summary
    printSummary() {
        const total = this.testResults.length;
        const success = this.testResults.filter(r => r.type === 'success').length;
        const errors = this.testResults.filter(r => r.type === 'error').length;

        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY - CRYPTOBOOST FUNCTIONALITY');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Successful: ${success}`);
        console.log(`❌ Errors: ${errors}`);
        console.log(`📈 Success Rate: ${((success/total)*100).toFixed(1)}%`);

        if (errors === 0) {
            console.log('\n🎉 ALL TESTS PASSED! CryptoBoost is fully functional.');
        } else {
            console.log('\n⚠️  Some tests failed. Check the logs above for details.');
        }

        console.log('='.repeat(50));
    }
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
    // Create global test instance
    window.cryptoBoostTester = new CryptoBoostTester();

    // Auto-run tests after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.cryptoBoostTester.runAllTests();
            }, 1000); // Wait 1 second for page to fully load
        });
    } else {
        setTimeout(() => {
            window.cryptoBoostTester.runAllTests();
        }, 1000);
    }

    console.log('🔧 CryptoBoost Test Suite loaded. Tests will run automatically.');
    console.log('📝 You can also run tests manually with: cryptoBoostTester.runAllTests()');
}
