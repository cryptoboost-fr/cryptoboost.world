// Targeted Troubleshooting - Based on Netlify Deploy Logs
// The deployment was successful, so the issue is elsewhere

console.log('🎯 TARGETED TROUBLESHOOTING - POST-DEPLOYMENT ANALYSIS');
console.log('======================================================');

console.log('\n📊 DEPLOYMENT STATUS:');
console.log('✅ Build completed successfully');
console.log('✅ Functions bundled: coinapi.js, db.js, github-db.js');
console.log('✅ Site deployed and live');
console.log('✅ 2 new files uploaded');

// Test 1: Check if the issue is SSL-specific
console.log('\n🔍 TEST 1: SSL vs Content Issue');
console.log('-------------------------------');

const url = window.location.href;
console.log(`Current URL: ${url}`);

if (url.includes('https://')) {
    console.log('✅ HTTPS protocol detected');
} else {
    console.log('❌ HTTP protocol - may cause mixed content issues');
}

// Test 2: Check if JavaScript files are actually loading
console.log('\n🔍 TEST 2: JavaScript File Loading');
console.log('----------------------------------');

const jsFiles = [
    'app.js',
    'auth.js',
    'crypto-api.js'
];

jsFiles.forEach(async (file) => {
    try {
        const response = await fetch(`/${file}`, {
            method: 'HEAD',
            cache: 'no-cache'
        });

        if (response.ok) {
            console.log(`✅ ${file}: ${response.status} ${response.statusText}`);
        } else {
            console.log(`❌ ${file}: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.log(`❌ ${file}: ${error.message}`);
    }
});

// Test 3: Check if functions are responding
console.log('\n🔍 TEST 3: Netlify Functions Status');
console.log('-----------------------------------');

const functions = [
    '/.netlify/functions/github-db?collection=users',
    '/.netlify/functions/github-db?collection=transactions',
    '/.netlify/functions/coinapi?action=rates&quote=EUR'
];

functions.forEach(async (funcUrl) => {
    try {
        const response = await fetch(funcUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        console.log(`📊 ${funcUrl}: ${response.status}`);

        if (response.status === 200) {
            console.log(`   ✅ Function responding correctly`);
        } else if (response.status === 404) {
            console.log(`   ❌ Function not found - deployment issue`);
        } else if (response.status >= 500) {
            console.log(`   ❌ Server error - check environment variables`);
        } else {
            console.log(`   ⚠️  Unexpected status: ${response.status}`);
        }

        // Check response content
        try {
            const contentType = response.headers.get('content-type');
            console.log(`   📋 Content-Type: ${contentType}`);

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log(`   📊 Response size: ${JSON.stringify(data).length} chars`);
            } else {
                const text = await response.text();
                console.log(`   📊 Response preview: ${text.substring(0, 100)}...`);
            }
        } catch (contentError) {
            console.log(`   ❌ Error reading response: ${contentError.message}`);
        }

    } catch (error) {
        console.log(`❌ ${funcUrl}: ${error.message}`);

        if (error.message.includes('CORS')) {
            console.log(`   🔒 CORS issue detected`);
        } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
            console.log(`   🔒 SSL/certificate issue`);
        } else if (error.message.includes('NetworkError')) {
            console.log(`   🌐 Network connectivity issue`);
        }
    }
});

// Test 4: Check for JavaScript execution issues
console.log('\n🔍 TEST 4: JavaScript Execution');
console.log('-------------------------------');

setTimeout(() => {
    // Check if our critical functions exist
    const criticalFunctions = [
        'showDashboard',
        'showLogin',
        'logout',
        'validateAuth',
        'getCurrentUser'
    ];

    let availableFunctions = 0;
    criticalFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName} function available`);
            availableFunctions++;
        } else {
            console.log(`❌ ${funcName} function missing`);
        }
    });

    console.log(`📊 Functions available: ${availableFunctions}/${criticalFunctions.length}`);

    if (availableFunctions === criticalFunctions.length) {
        console.log('✅ All critical functions loaded');
    } else {
        console.log('❌ Some critical functions missing - JavaScript loading issue');
    }
}, 2000);

// Test 5: Check for DOM manipulation issues
console.log('\n🔍 TEST 5: DOM and UI Elements');
console.log('------------------------------');

setTimeout(() => {
    const criticalElements = [
        { id: 'dashboard', name: 'Dashboard Container' },
        { id: 'loginModal', name: 'Login Modal' },
        { id: 'main-content', name: 'Main Content Area' }
    ];

    let visibleElements = 0;
    criticalElements.forEach(element => {
        const el = document.getElementById(element.id);
        if (el) {
            const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0;
            const isInDOM = document.contains(el);

            if (isInDOM) {
                console.log(`✅ ${element.name} in DOM`);
                if (isVisible) {
                    console.log(`   👁️  ${element.name} is visible`);
                    visibleElements++;
                } else {
                    console.log(`   🙈 ${element.name} hidden (display: ${getComputedStyle(el).display})`);
                }
            } else {
                console.log(`❌ ${element.name} not in DOM`);
            }
        } else {
            console.log(`❌ ${element.name} element not found`);
        }
    });

    console.log(`📊 Visible elements: ${visibleElements}/${criticalElements.length}`);
}, 3000);

// Test 6: Check for CSS issues
console.log('\n🔍 TEST 6: CSS and Styling');
console.log('--------------------------');

setTimeout(() => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(`📊 Found ${stylesheets.length} CSS files`);

    stylesheets.forEach((sheet, index) => {
        console.log(`   ${index + 1}. ${sheet.href || 'inline'}`);
    });

    // Check if styles are loaded
    const body = document.body;
    if (body) {
        const computedStyle = getComputedStyle(body);
        console.log(`✅ Body styling loaded`);
        console.log(`   📋 Background: ${computedStyle.backgroundColor}`);
        console.log(`   📋 Font: ${computedStyle.fontFamily}`);
    }
}, 4000);

// Test 7: Check for console errors
console.log('\n🔍 TEST 7: Console Error Monitoring');
console.log('----------------------------------');

const originalError = console.error;
const originalWarn = console.warn;
let errorCount = 0;
let warningCount = 0;

console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
};

console.warn = function(...args) {
    warningCount++;
    originalWarn.apply(console, args);
};

setTimeout(() => {
    console.log(`📊 Errors detected: ${errorCount}`);
    console.log(`📊 Warnings detected: ${warningCount}`);

    if (errorCount > 0) {
        console.log('❌ JavaScript errors detected - check console');
    } else {
        console.log('✅ No JavaScript errors detected');
    }

    // Restore original functions
    console.error = originalError;
    console.warn = originalWarn;
}, 5000);

// Final analysis
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 TROUBLESHOOTING RESULTS');
    console.log('='.repeat(60));

    console.log('\n📋 DEPLOYMENT ANALYSIS:');
    console.log('✅ Netlify build successful');
    console.log('✅ Functions bundled correctly');
    console.log('✅ Site deployed and live');
    console.log('✅ No deployment errors detected');

    console.log('\n🔍 LIKELY CAUSES:');

    // Analyze the results
    const issues = [];

    // Check if functions are responding
    // This will be determined by the function tests above

    console.log('\n🛠️  IMMEDIATE ACTIONS:');
    console.log('1. Check browser developer tools for specific errors');
    console.log('2. Try accessing functions directly in browser');
    console.log('3. Check if JavaScript files are loading correctly');
    console.log('4. Verify environment variables in Netlify');

    console.log('\n📞 IF ISSUES PERSIST:');
    console.log('1. Check Netlify function logs');
    console.log('2. Verify GitHub token permissions');
    console.log('3. Check repository access');
    console.log('4. Review function code for syntax errors');

    console.log('\n' + '='.repeat(60));
    console.log('🔍 ANALYSIS COMPLETE');
    console.log('='.repeat(60));

}, 6000);
