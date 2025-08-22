// Comprehensive Site Diagnostic - All Possible Issues
// Copy and paste this into browser console to test everything

console.log('🔍 COMPREHENSIVE SITE DIAGNOSTIC');
console.log('=================================');
console.log('Testing all possible access issues...\n');

// Global test results
window.diagnosticResults = {
    connectivity: {},
    content: {},
    javascript: {},
    api: {},
    security: {},
    performance: {}
};

// Test 1: Basic Site Loading
console.log('📋 TEST 1: Basic Site Loading');
console.log('-----------------------------');

window.diagnosticResults.connectivity.siteLoad = 'testing';

try {
    // Check if we can even load the page
    if (document.readyState === 'loading') {
        console.log('⚠️  Page still loading...');
    } else {
        console.log('✅ Page loaded successfully');
        window.diagnosticResults.connectivity.siteLoad = 'success';
    }

    // Check for critical elements that should exist
    const criticalElements = [
        { selector: 'html', name: 'HTML root' },
        { selector: 'head', name: 'Head section' },
        { selector: 'body', name: 'Body section' },
        { selector: 'title', name: 'Page title' }
    ];

    criticalElements.forEach(element => {
        const el = document.querySelector(element.selector);
        if (el) {
            console.log(`✅ ${element.name} found`);
        } else {
            console.log(`❌ ${element.name} missing`);
            window.diagnosticResults.connectivity.siteLoad = 'error';
        }
    });

} catch (error) {
    console.log(`❌ Site loading error: ${error.message}`);
    window.diagnosticResults.connectivity.siteLoad = 'error';
}

// Test 2: JavaScript Loading Issues
setTimeout(() => {
    console.log('\n📋 TEST 2: JavaScript Loading');
    console.log('-----------------------------');

    window.diagnosticResults.javascript.loading = 'testing';

    // Check if JavaScript is working at all
    try {
        console.log('✅ JavaScript execution working');

        // Check for script tags
        const scripts = document.querySelectorAll('script');
        console.log(`📊 Found ${scripts.length} script tags`);

        scripts.forEach((script, index) => {
            const src = script.src || 'inline';
            console.log(`   ${index + 1}. ${src}`);
        });

        // Check for critical JavaScript functions
        const criticalFunctions = [
            'showDashboard', 'showLogin', 'logout', 'validateAuth', 'getCurrentUser'
        ];

        criticalFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ ${funcName} function available`);
            } else {
                console.log(`❌ ${funcName} function missing`);
                window.diagnosticResults.javascript.loading = 'error';
            }
        });

        window.diagnosticResults.javascript.loading = 'success';

    } catch (error) {
        console.log(`❌ JavaScript loading error: ${error.message}`);
        window.diagnosticResults.javascript.loading = 'error';
    }
}, 1000);

// Test 3: Content Loading Issues
setTimeout(() => {
    console.log('\n📋 TEST 3: Content Loading');
    console.log('---------------------------');

    window.diagnosticResults.content.loading = 'testing';

    try {
        // Check for main content areas
        const contentAreas = [
            { selector: '#main-content', name: 'Main Content Area' },
            { selector: '#dashboard', name: 'Dashboard Container' },
            { selector: '.container', name: 'Container Elements' },
            { selector: 'header, nav', name: 'Navigation Elements' }
        ];

        contentAreas.forEach(area => {
            const elements = document.querySelectorAll(area.selector);
            if (elements.length > 0) {
                console.log(`✅ ${area.name} found (${elements.length})`);
            } else {
                console.log(`⚠️  ${area.name} not found`);
            }
        });

        // Check for text content
        const bodyText = document.body.textContent.trim();
        if (bodyText.length > 100) {
            console.log(`✅ Page content loaded (${bodyText.length} characters)`);
        } else {
            console.log(`⚠️  Limited page content (${bodyText.length} characters)`);
            window.diagnosticResults.content.loading = 'warning';
        }

        // Check for images
        const images = document.querySelectorAll('img');
        console.log(`📊 Found ${images.length} images`);

        images.forEach((img, index) => {
            if (img.complete && img.naturalHeight !== 0) {
                console.log(`   ✅ Image ${index + 1}: Loaded`);
            } else {
                console.log(`   ❌ Image ${index + 1}: Failed to load`);
                window.diagnosticResults.content.loading = 'error';
            }
        });

        window.diagnosticResults.content.loading = 'success';

    } catch (error) {
        console.log(`❌ Content loading error: ${error.message}`);
        window.diagnosticResults.content.loading = 'error';
    }
}, 2000);

// Test 4: API Endpoints
setTimeout(() => {
    console.log('\n📋 TEST 4: API Endpoints');
    console.log('-----------------------');

    window.diagnosticResults.api.endpoints = 'testing';

    const apiEndpoints = [
        { url: '/.netlify/functions/github-db?collection=users', name: 'Users API' },
        { url: '/.netlify/functions/github-db?collection=transactions', name: 'Transactions API' },
        { url: '/.netlify/functions/github-db?collection=wallets', name: 'Wallets API' },
        { url: '/.netlify/functions/coinapi?action=rates&quote=EUR', name: 'CoinAPI' }
    ];

    let apiTestsCompleted = 0;

    apiEndpoints.forEach(async (endpoint) => {
        try {
            const response = await fetch(`https://cryptoboost.world${endpoint.url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                console.log(`✅ ${endpoint.name}: ${response.status}`);
            } else if (response.status === 404) {
                console.log(`❌ ${endpoint.name}: ${response.status} (Not Found)`);
                window.diagnosticResults.api.endpoints = 'error';
            } else if (response.status >= 500) {
                console.log(`❌ ${endpoint.name}: ${response.status} (Server Error)`);
                window.diagnosticResults.api.endpoints = 'error';
            } else {
                console.log(`⚠️  ${endpoint.name}: ${response.status} (Unexpected)`);
            }

        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);
            window.diagnosticResults.api.endpoints = 'error';
        }

        apiTestsCompleted++;
        if (apiTestsCompleted === apiEndpoints.length) {
            if (window.diagnosticResults.api.endpoints === 'testing') {
                window.diagnosticResults.api.endpoints = 'success';
            }
        }
    });
}, 3000);

// Test 5: Security and CORS Issues
setTimeout(() => {
    console.log('\n📋 TEST 5: Security & CORS');
    console.log('--------------------------');

    window.diagnosticResults.security.cors = 'testing';

    try {
        // Test CORS by making requests
        const corsTest = fetch('https://cryptoboost.world/.netlify/functions/github-db?collection=users', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Origin': 'https://cryptoboost.world'
            }
        });

        corsTest.then(response => {
            if (response.ok) {
                console.log('✅ CORS working correctly');
                window.diagnosticResults.security.cors = 'success';
            } else {
                console.log(`⚠️  CORS response: ${response.status}`);
                window.diagnosticResults.security.cors = 'warning';
            }
        }).catch(error => {
            console.log(`❌ CORS error: ${error.message}`);
            window.diagnosticResults.security.cors = 'error';
        });

        // Check for mixed content
        const mixedContent = [];
        document.querySelectorAll('img, script, link, iframe').forEach(element => {
            const src = element.src || element.href;
            if (src && src.startsWith('http://')) {
                mixedContent.push(src);
            }
        });

        if (mixedContent.length === 0) {
            console.log('✅ No mixed content detected');
        } else {
            console.log(`⚠️  Found ${mixedContent.length} mixed content resources`);
            mixedContent.slice(0, 3).forEach(src => {
                console.log(`   - ${src}`);
            });
            window.diagnosticResults.security.cors = 'warning';
        }

    } catch (error) {
        console.log(`❌ Security test error: ${error.message}`);
        window.diagnosticResults.security.cors = 'error';
    }
}, 4000);

// Test 6: Performance and Loading Issues
setTimeout(() => {
    console.log('\n📋 TEST 6: Performance & Loading');
    console.log('--------------------------------');

    window.diagnosticResults.performance.loading = 'testing';

    try {
        // Check page load time
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

            console.log(`📊 Page load time: ${loadTime}ms`);
            console.log(`📊 DOM ready time: ${domReady}ms`);

            if (loadTime < 3000) {
                console.log('✅ Page load time acceptable');
            } else {
                console.log('⚠️  Page load time slow');
                window.diagnosticResults.performance.loading = 'warning';
            }
        }

        // Check for console errors
        const originalConsoleError = console.error;
        let errorCount = 0;
        console.error = function(...args) {
            errorCount++;
            originalConsoleError.apply(console, args);
        };

        setTimeout(() => {
            console.error = originalConsoleError;
            if (errorCount === 0) {
                console.log('✅ No console errors detected');
            } else {
                console.log(`⚠️  ${errorCount} console errors detected`);
                window.diagnosticResults.performance.loading = 'warning';
            }

            if (window.diagnosticResults.performance.loading === 'testing') {
                window.diagnosticResults.performance.loading = 'success';
            }
        }, 2000);

    } catch (error) {
        console.log(`❌ Performance test error: ${error.message}`);
        window.diagnosticResults.performance.loading = 'error';
    }
}, 5000);

// Test 7: Network and Connectivity Issues
setTimeout(() => {
    console.log('\n📋 TEST 7: Network & Connectivity');
    console.log('---------------------------------');

    window.diagnosticResults.connectivity.network = 'testing';

    try {
        // Test internet connectivity
        fetch('https://httpbin.org/ip', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            console.log(`✅ Internet connectivity: ${data.origin}`);
            window.diagnosticResults.connectivity.network = 'success';
        })
        .catch(error => {
            console.log(`❌ Internet connectivity: ${error.message}`);
            window.diagnosticResults.connectivity.network = 'error';
        });

        // Test DNS resolution
        fetch('https://dns.google/resolve?name=cryptoboost.world&type=A')
        .then(response => response.json())
        .then(data => {
            if (data.Answer && data.Answer.length > 0) {
                console.log(`✅ DNS resolution: ${data.Answer[0].data}`);
            } else {
                console.log('❌ DNS resolution failed');
                window.diagnosticResults.connectivity.network = 'error';
            }
        })
        .catch(error => {
            console.log(`❌ DNS test error: ${error.message}`);
            window.diagnosticResults.connectivity.network = 'error';
        });

    } catch (error) {
        console.log(`❌ Network test error: ${error.message}`);
        window.diagnosticResults.connectivity.network = 'error';
    }
}, 6000);

// Final Summary
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 COMPREHENSIVE DIAGNOSTIC SUMMARY');
    console.log('='.repeat(60));

    // Analyze all results
    const allResults = Object.values(window.diagnosticResults).flatMap(category =>
        Object.values(category)
    );

    const errors = allResults.filter(result => result === 'error').length;
    const warnings = allResults.filter(result => result === 'warning').length;
    const successes = allResults.filter(result => result === 'success').length;

    console.log('\n📊 OVERALL RESULTS:');
    console.log(`   ✅ Successful: ${successes}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📈 Success Rate: ${Math.round((successes / allResults.length) * 100)}%`);

    console.log('\n🔍 DETAILED RESULTS BY CATEGORY:');

    // Display category results
    Object.entries(window.diagnosticResults).forEach(([category, tests]) => {
        console.log(`\n${category.toUpperCase()}:`);
        Object.entries(tests).forEach(([test, result]) => {
            const icon = result === 'success' ? '✅' : result === 'error' ? '❌' : '⚠️';
            console.log(`   ${icon} ${test.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${result}`);
        });
    });

    console.log('\n🔧 RECOMMENDED ACTIONS:');

    if (errors > 0) {
        console.log('\n🚨 CRITICAL ISSUES FOUND:');
        if (window.diagnosticResults.api.endpoints === 'error') {
            console.log('   - API endpoints not responding');
            console.log('   - Check Netlify functions configuration');
            console.log('   - Verify GitHub token and repository access');
        }
        if (window.diagnosticResults.javascript.loading === 'error') {
            console.log('   - JavaScript files not loading');
            console.log('   - Check script tag sources');
            console.log('   - Verify file paths and CDN links');
        }
        if (window.diagnosticResults.content.loading === 'error') {
            console.log('   - Page content not loading');
            console.log('   - Check HTML structure');
            console.log('   - Verify CSS and asset loading');
        }
    }

    if (warnings > 0) {
        console.log('\n⚠️  PERFORMANCE ISSUES:');
        if (window.diagnosticResults.performance.loading === 'warning') {
            console.log('   - Slow page loading detected');
            console.log('   - Optimize images and scripts');
            console.log('   - Enable compression');
        }
        if (window.diagnosticResults.security.cors === 'warning') {
            console.log('   - Mixed content detected');
            console.log('   - Use HTTPS for all resources');
        }
    }

    console.log('\n📞 NEXT STEPS:');
    console.log('   1. Check Netlify deploy logs');
    console.log('   2. Verify environment variables');
    console.log('   3. Test API functions individually');
    console.log('   4. Check browser developer tools');

    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNOSTIC COMPLETE');
    console.log('='.repeat(60));

}, 7000);
