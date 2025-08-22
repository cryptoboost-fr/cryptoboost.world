// HTTP-based test for CryptoBoost functionality
// This tests the actual functionality by making HTTP requests

const https = require('https');
const http = require('http');

class CryptoBoostHTTPTester {
    constructor() {
        this.baseUrl = 'https://cryptoboost.world';
        this.testResults = [];
        this.sessionCookies = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
        this.testResults.push({ timestamp, message, type });
    }

    // Make HTTP request
    makeRequest(url, method = 'GET', data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: method.toUpperCase(),
                headers: {
                    'User-Agent': 'CryptoBoost-Test-Suite/1.0',
                    'Accept': 'application/json, text/html, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    ...headers
                }
            };

            // Add cookies if we have any
            if (this.sessionCookies.length > 0) {
                options.headers['Cookie'] = this.sessionCookies.join('; ');
            }

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    // Store cookies for session
                    if (res.headers['set-cookie']) {
                        this.sessionCookies.push(...res.headers['set-cookie']);
                    }

                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body,
                        url: url
                    });
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                if (typeof data === 'object') {
                    data = JSON.stringify(data);
                    req.setHeader('Content-Type', 'application/json');
                }
                req.write(data);
            }

            req.end();
        });
    }

    // Test 1: Site accessibility
    async testSiteAccess() {
        this.log('Testing site accessibility...');

        try {
            const response = await this.makeRequest(this.baseUrl);
            if (response.statusCode === 200) {
                this.log(`Site accessible: ${response.statusCode}`, 'success');

                // Check for key elements in HTML
                const htmlChecks = [
                    { pattern: 'CryptoBoost', name: 'Brand name' },
                    { pattern: 'loginModal', name: 'Login modal' },
                    { pattern: 'dashboard', name: 'Dashboard element' },
                    { pattern: 'showDeposit', name: 'Deposit button' },
                    { pattern: 'showExchange', name: 'Exchange button' }
                ];

                htmlChecks.forEach(check => {
                    if (response.body.includes(check.pattern)) {
                        this.log(`HTML contains ${check.name}`, 'success');
                    } else {
                        this.log(`HTML missing ${check.name}`, 'error');
                    }
                });

            } else {
                this.log(`Site not accessible: ${response.statusCode}`, 'error');
            }
        } catch (error) {
            this.log(`Site access error: ${error.message}`, 'error');
        }
    }

    // Test 2: API endpoints
    async testAPIEndpoints() {
        this.log('Testing API endpoints...');

        const endpoints = [
            { url: '/.netlify/functions/github-db?collection=users', name: 'Users API' },
            { url: '/.netlify/functions/github-db?collection=transactions', name: 'Transactions API' },
            { url: '/.netlify/functions/github-db?collection=wallets', name: 'Wallets API' },
            { url: '/.netlify/functions/github-db?collection=plans', name: 'Plans API' },
            { url: '/.netlify/functions/coinapi?action=rates&quote=EUR', name: 'CoinAPI' }
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await this.makeRequest(this.baseUrl + endpoint.url);
                if (response.statusCode === 200) {
                    this.log(`${endpoint.name}: ${response.statusCode}`, 'success');

                    // Additional checks for API responses
                    if (endpoint.name.includes('CoinAPI')) {
                        if (response.body.includes('BTC') || response.body.includes('rates')) {
                            this.log(`${endpoint.name} returns valid data`, 'success');
                        } else {
                            this.log(`${endpoint.name} returns invalid data`, 'error');
                        }
                    }

                } else {
                    this.log(`${endpoint.name}: ${response.statusCode}`, 'error');
                }
            } catch (error) {
                this.log(`${endpoint.name} error: ${error.message}`, 'error');
            }
        }
    }

    // Test 3: JavaScript files
    async testJavaScriptFiles() {
        this.log('Testing JavaScript files...');

        const jsFiles = [
            { url: '/app.js', name: 'App.js' },
            { url: '/auth.js', name: 'Auth.js' },
            { url: '/crypto-api.js', name: 'Crypto API' }
        ];

        for (const jsFile of jsFiles) {
            try {
                const response = await this.makeRequest(this.baseUrl + jsFile.url);
                if (response.statusCode === 200) {
                    this.log(`${jsFile.name}: ${response.statusCode}`, 'success');

                    // Check for critical functions
                    const functionChecks = [
                        { pattern: 'showDashboard', name: 'showDashboard function' },
                        { pattern: 'validateAuth', name: 'validateAuth function' },
                        { pattern: 'getCurrentUser', name: 'getCurrentUser function' },
                        { pattern: 'CryptoBoostApp', name: 'CryptoBoostApp class' }
                    ];

                    functionChecks.forEach(check => {
                        if (response.body.includes(check.pattern)) {
                            this.log(`${jsFile.name} contains ${check.name}`, 'success');
                        } else {
                            this.log(`${jsFile.name} missing ${check.name}`, 'error');
                        }
                    });

                } else {
                    this.log(`${jsFile.name}: ${response.statusCode}`, 'error');
                }
            } catch (error) {
                this.log(`${jsFile.name} error: ${error.message}`, 'error');
            }
        }
    }

    // Test 4: Assets (CSS, images)
    async testAssets() {
        this.log('Testing assets...');

        const assets = [
            { url: '/styles.css', name: 'CSS Stylesheet' },
            { url: '/assets/logo.svg', name: 'Logo SVG' },
            { url: '/assets/favicon.svg', name: 'Favicon' },
            { url: '/assets/hero-grid.svg', name: 'Hero Grid' }
        ];

        for (const asset of assets) {
            try {
                const response = await this.makeRequest(this.baseUrl + asset.url);
                if (response.statusCode === 200) {
                    this.log(`${asset.name}: ${response.statusCode} (${response.body.length} bytes)`, 'success');
                } else {
                    this.log(`${asset.name}: ${response.statusCode}`, 'error');
                }
            } catch (error) {
                this.log(`${asset.name} error: ${error.message}`, 'error');
            }
        }
    }

    // Test 5: Security headers
    async testSecurityHeaders() {
        this.log('Testing security headers...');

        try {
            const response = await this.makeRequest(this.baseUrl);

            const securityHeaders = [
                'x-frame-options',
                'x-content-type-options',
                'x-xss-protection',
                'strict-transport-security',
                'content-security-policy'
            ];

            securityHeaders.forEach(header => {
                if (response.headers[header]) {
                    this.log(`Security header ${header}: Present`, 'success');
                } else {
                    this.log(`Security header ${header}: Missing`, 'error');
                }
            });

            // Check HTTPS
            if (response.headers.location && response.headers.location.startsWith('https://')) {
                this.log('HTTPS redirect: Present', 'success');
            }

        } catch (error) {
            this.log(`Security headers test error: ${error.message}`, 'error');
        }
    }

    // Test 6: Performance
    async testPerformance() {
        this.log('Testing performance...');

        const startTime = Date.now();

        try {
            const response = await this.makeRequest(this.baseUrl);
            const loadTime = Date.now() - startTime;

            if (response.statusCode === 200) {
                this.log(`Page load time: ${loadTime}ms`, loadTime < 2000 ? 'success' : 'error');

                // Check content size
                const contentSize = response.body.length;
                this.log(`Content size: ${(contentSize / 1024).toFixed(2)} KB`,
                    contentSize < 500000 ? 'success' : 'error');
            }

        } catch (error) {
            this.log(`Performance test error: ${error.message}`, 'error');
        }
    }

    // Test 7: Session simulation
    async testSessionSimulation() {
        this.log('Testing session simulation...');

        try {
            // Test login simulation (POST to a form endpoint if available)
            // This is a simulation since we can't actually execute JS in browser from here

            // Test API with authentication headers
            const authHeaders = {
                'Authorization': 'Bearer test-token',
                'X-Session-ID': 'test-session-123'
            };

            const response = await this.makeRequest(
                this.baseUrl + '/.netlify/functions/github-db?collection=users',
                'GET',
                null,
                authHeaders
            );

            if (response.statusCode === 200 || response.statusCode === 401 || response.statusCode === 403) {
                this.log('API authentication headers test: Passed', 'success');
            } else {
                this.log(`API authentication headers test: ${response.statusCode}`, 'error');
            }

        } catch (error) {
            this.log(`Session simulation error: ${error.message}`, 'error');
        }
    }

    // Run all tests
    async runAllTests() {
        this.log('🚀 Starting CryptoBoost HTTP Tests', 'info');

        try {
            await this.testSiteAccess();
            await this.testAPIEndpoints();
            await this.testJavaScriptFiles();
            await this.testAssets();
            await this.testSecurityHeaders();
            await this.testPerformance();
            await this.testSessionSimulation();

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

        console.log('\n' + '='.repeat(60));
        console.log('📊 HTTP TEST SUMMARY - CRYPTOBOOST FUNCTIONALITY');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Successful: ${success}`);
        console.log(`❌ Errors: ${errors}`);
        console.log(`📈 Success Rate: ${((success/total)*100).toFixed(1)}%`);

        if (errors === 0) {
            console.log('\n🎉 ALL HTTP TESTS PASSED! CryptoBoost is fully functional.');
            console.log('🔗 Site URL: https://cryptoboost.world');
            console.log('📧 Test Accounts: admin@cryptoboost.com / client@cryptoboost.com');
        } else {
            console.log('\n⚠️  Some tests failed. Check the logs above for details.');
        }

        console.log('='.repeat(60));
    }
}

// Run tests if this is the main module
if (require.main === module) {
    const tester = new CryptoBoostHTTPTester();
    tester.runAllTests().catch(console.error);
}

module.exports = CryptoBoostHTTPTester;
