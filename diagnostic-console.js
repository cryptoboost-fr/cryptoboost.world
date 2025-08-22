// 🎯 DIAGNOSTIC IMMÉDIAT CRYPTOBOOST
// COPIEZ TOUT CE SCRIPT DANS LA CONSOLE DU NAVIGATEUR SUR https://cryptoboost.world

console.log('🚀 DIAGNOSTIC RAPIDE CRYPTOBOOST');
console.log('===============================');
console.log(`⏰ ${new Date().toLocaleString()}`);
console.log(`🌐 ${window.location.href}`);

let tests = 0;
let success = 0;
let errors = 0;
let warnings = 0;

function check(name, condition, severity = 'normal') {
    tests++;
    if (condition) {
        console.log(`✅ ${name}`);
        success++;
        return true;
    } else {
        const icon = severity === 'high' ? '❌' : severity === 'medium' ? '🟠' : '⚠️';
        console.log(`${icon} ${name}`);
        if (severity === 'high') errors++;
        else warnings++;
        return false;
    }
}

// Test 1: Connectivité et HTTPS
console.log('\n🌐 TEST 1: CONNEXIVITÉ');
console.log('======================');

check('Site accessible', true, 'high');
check('HTTPS actif', window.location.protocol === 'https:', 'high');
check('Titre CryptoBoost', document.title.includes('CryptoBoost'), 'medium');

// Test 2: Ressources critiques
console.log('\n📦 TEST 2: RESSOURCES CRITIQUES');
console.log('==============================');

const criticalAssets = [
    { name: 'CSS Principal', url: '/styles.css', critical: true },
    { name: 'App JS', url: '/app.js', critical: true },
    { name: 'Auth JS', url: '/auth.js', critical: true },
    { name: 'Logo SVG', url: '/assets/logo.svg', critical: false },
    { name: 'Favicon', url: '/favicon.ico', critical: false }
];

(async () => {
    for (const asset of criticalAssets) {
        try {
            const response = await fetch(asset.url, { method: 'HEAD' });
            check(`${asset.name}`, response.ok, asset.critical ? 'high' : 'medium');
        } catch (error) {
            check(`${asset.name}`, false, asset.critical ? 'high' : 'medium');
        }
    }

    // Test 3: Fonctions JavaScript
    console.log('\n⚙️ TEST 3: FONCTIONS JAVASCRIPT');
    console.log('==============================');

    const criticalFunctions = [
        'showLogin', 'showRegister', 'logout', 'validateAuth',
        'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange'
    ];

    criticalFunctions.forEach(funcName => {
        check(`Fonction ${funcName}`, typeof window[funcName] === 'function', 'high');
    });

    // Test 4: Éléments HTML
    console.log('\n📋 TEST 4: ÉLÉMENTS HTML');
    console.log('========================');

    const htmlElements = [
        { id: 'stats', name: 'Section Stats', critical: false },
        { id: 'features', name: 'Section Features', critical: false },
        { id: 'testimonials', name: 'Section Testimonials', critical: false },
        { id: 'faq', name: 'Section FAQ', critical: false },
        { id: 'contact', name: 'Section Contact', critical: false },
        { id: 'loginModal', name: 'Modal Login', critical: true },
        { id: 'registerModal', name: 'Modal Register', critical: true }
    ];

    htmlElements.forEach(element => {
        check(`${element.name}`, !!document.getElementById(element.id), element.critical ? 'high' : 'medium');
    });

    // Test 5: APIs Netlify
    console.log('\n🔗 TEST 5: APIs NETLIFY');
    console.log('========================');

    const apiEndpoints = [
        { name: 'GitHub DB', url: '/.netlify/functions/github-db?collection=users' },
        { name: 'CoinAPI', url: '/.netlify/functions/coinapi?action=rates&quote=EUR' }
    ];

    for (const api of apiEndpoints) {
        try {
            const response = await fetch(api.url, { method: 'GET' });
            check(`API ${api.name}`, response.ok, 'high');
        } catch (error) {
            check(`API ${api.name}`, false, 'high');
        }
    }

    // Test 6: Performance
    console.log('\n⚡ TEST 6: PERFORMANCE');
    console.log('====================');

    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        check(`Temps de chargement (${loadTime}ms)`, loadTime < 5000, loadTime > 8000 ? 'high' : 'medium');
    }

    const domSize = document.querySelectorAll('*').length;
    check(`Taille DOM (${domSize} éléments)`, domSize < 2000, domSize > 3000 ? 'high' : 'medium');

    // Test 7: Sécurité
    console.log('\n🔒 TEST 7: SÉCURITÉ');
    console.log('==================');

    check('HTTPS actif', window.location.protocol === 'https:', 'high');

    // Rapport final
    setTimeout(() => {
        const score = Math.round((success / tests) * 100);

        console.log('\n' + '='.repeat(60));
        console.log('🎯 RAPPORT FINAL DIAGNOSTIC CRYPTOBOOST');
        console.log('='.repeat(60));

        console.log(`\n📊 RÉSULTATS:`);
        console.log(`============`);
        console.log(`✅ Tests réussis: ${success}/${tests}`);
        console.log(`❌ Erreurs critiques: ${errors}`);
        console.log(`⚠️ Avertissements: ${warnings}`);
        console.log(`🎯 Score global: ${score}%`);

        console.log(`\n📋 ÉVALUATION:`);
        console.log(`==============`);

        if (score >= 90) {
            console.log('🎉 EXCELLENT - Site parfait !');
        } else if (score >= 75) {
            console.log('👍 TRÈS BON - Quelques améliorations mineures');
        } else if (score >= 50) {
            console.log('⚠️ MOYEN - Corrections nécessaires');
        } else {
            console.log('❌ CRITIQUE - Problèmes majeurs');
        }

        console.log(`\n📅 RÉSUMÉ:`);
        console.log(`==========`);
        console.log(`🌐 Site testé: ${window.location.href}`);
        console.log(`📅 Date: ${new Date().toLocaleString()}`);

        console.log('\n' + '='.repeat(60));
        console.log('🏁 DIAGNOSTIC TERMINÉ');
        console.log('='.repeat(60));

    }, 2000);

})();

console.log('🔍 Diagnostic en cours...');
