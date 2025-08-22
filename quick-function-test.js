// Quick Function Test - Direct Testing
// Copy this into browser console for immediate results

console.log('🚀 QUICK FUNCTION TEST');
console.log('======================');

// Test 1: Check if we can access the site at all
console.log('\n1. Site Accessibility:');
console.log(`   URL: ${window.location.href}`);
console.log(`   Protocol: ${window.location.protocol}`);
console.log(`   Ready State: ${document.readyState}`);

// Test 2: Check critical functions immediately
console.log('\n2. Critical Functions Check:');

const criticalFunctions = [
    'showDashboard', 'showLogin', 'logout', 'validateAuth', 'getCurrentUser',
    'showDeposit', 'showWithdraw', 'showExchange', 'showInvest'
];

let availableCount = 0;
criticalFunctions.forEach(func => {
    if (typeof window[func] === 'function') {
        console.log(`   ✅ ${func} - AVAILABLE`);
        availableCount++;
    } else {
        console.log(`   ❌ ${func} - MISSING`);
    }
});

console.log(`   📊 Available: ${availableCount}/${criticalFunctions.length}`);

// Test 3: Check HTML elements immediately
console.log('\n3. HTML Elements Check:');

const elements = [
    'dashboard', 'loginModal', 'main-content', 'exchangeModal', 'depositModal', 'withdrawModal'
];

let foundCount = 0;
elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        console.log(`   ✅ ${id} - FOUND`);
        foundCount++;
    } else {
        console.log(`   ❌ ${id} - MISSING`);
    }
});

console.log(`   📊 Found: ${foundCount}/${elements.length}`);

// Test 4: Quick API test
console.log('\n4. Quick API Test:');

const apiTests = [
    '/.netlify/functions/github-db?collection=users',
    '/.netlify/functions/coinapi?action=rates&quote=EUR'
];

apiTests.forEach(async (url) => {
    try {
        const response = await fetch(url);
        console.log(`   📊 ${url}: ${response.status}`);
    } catch (error) {
        console.log(`   ❌ ${url}: ${error.message}`);
    }
});

// Test 5: Console errors
console.log('\n5. Console Errors Check:');

const originalError = console.error;
let errorCount = 0;

console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
};

setTimeout(() => {
    console.error = originalError;
    console.log(`   📊 Console errors in last 2s: ${errorCount}`);

    if (errorCount > 0) {
        console.log('   ⚠️  Check browser console for details');
    }
}, 2000);

// Immediate analysis
setTimeout(() => {
    console.log('\n' + '='.repeat(40));
    console.log('📊 IMMEDIATE ANALYSIS');
    console.log('='.repeat(40));

    if (availableCount >= 8 && foundCount >= 5) {
        console.log('✅ CRITICAL SYSTEMS: WORKING');
        console.log('   The core functionality is loaded');
        console.log('   Issue might be with specific features');
    } else if (availableCount >= 5 && foundCount >= 3) {
        console.log('⚠️  PARTIAL FUNCTIONALITY');
        console.log('   Some components are missing');
        console.log('   Check JavaScript loading');
    } else {
        console.log('❌ CRITICAL ISSUES DETECTED');
        console.log('   Core systems not loading');
        console.log('   Check deployment and JavaScript files');
    }

    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Check browser developer tools (F12)');
    console.log('   2. Look for JavaScript errors in console');
    console.log('   3. Try refreshing the page');
    console.log('   4. Check network tab for failed requests');

    console.log('='.repeat(40));
}, 3000);
