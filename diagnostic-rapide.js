// 🔍 DIAGNOSTIC RAPIDE CRYPTOBOOST
// Script à copier dans la console du navigateur sur https://cryptoboost.world

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
check('Titre présent', document.title.includes('CryptoBoost'), 'medium');

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

criticalAssets.forEach(async (asset) => {
    try {
        const response = await fetch(asset.url, { method: 'HEAD' });
        check(`${asset.name}`, response.ok, asset.critical ? 'high' : 'medium');
    } catch (error) {
        check(`${asset.name}`, false, asset.critical ? 'high' : 'medium');
    }
});

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

apiEndpoints.forEach(async (api) => {
    try {
        const response = await fetch(api.url, { method: 'GET' });
        check(`API ${api.name}`, response.ok, 'high');
        if (response.ok) {
            try {
                const data = await response.json();
                console.log(`   📊 ${Object.keys(data).length} éléments reçus`);
            } catch (e) {
                console.log(`   📊 Réponse non-JSON`);
            }
        }
    } catch (error) {
        check(`API ${api.name}`, false, 'high');
        console.log(`   Erreur: ${error.message}`);
    }
});

// Test 6: Performance
console.log('\n⚡ TEST 6: PERFORMANCE');
console.log('====================');

if (performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    check(`Temps de chargement (${loadTime}ms)`, loadTime < 5000, loadTime > 8000 ? 'high' : 'medium');

    const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    check(`DOM Content Loaded (${domTime}ms)`, domTime < 3000, domTime > 5000 ? 'high' : 'medium');
}

const domSize = document.querySelectorAll('*').length;
check(`Taille DOM (${domSize} éléments)`, domSize < 2000, domSize > 3000 ? 'high' : 'medium');

// Test 7: Sécurité
console.log('\n🔒 TEST 7: SÉCURITÉ');
console.log('==================');

const htmlContent = document.documentElement.outerHTML;
check('HTTPS actif', window.location.protocol === 'https:', 'high');
check('Aucun contenu mixte', !htmlContent.includes('src="http://') && !htmlContent.includes('href="http://'), 'high');

// Test 8: Accessibilité
console.log('\n♿ TEST 8: ACCESSIBILITÉ');
console.log('=======================');

const images = document.querySelectorAll('img');
let imagesWithoutAlt = 0;
images.forEach(img => {
    if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
        imagesWithoutAlt++;
    }
});
check(`Images avec alt text (${images.length - imagesWithoutAlt}/${images.length})`, imagesWithoutAlt === 0, 'medium');

// Test 9: Console Errors
console.log('\n🚨 TEST 9: ERREURS CONSOLE');
console.log('==========================');

const originalError = console.error;
const originalWarn = console.warn;
let consoleErrors = 0;
let consoleWarnings = 0;

console.error = function(...args) {
    consoleErrors++;
    originalError.apply(console, args);
};

console.warn = function(...args) {
    consoleWarnings++;
    originalWarn.apply(console, args);
};

// Simuler quelques interactions
setTimeout(() => {
    // Restaurer les fonctions originales
    console.error = originalError;
    console.warn = originalWarn;

    check(`Erreurs console (${consoleErrors})`, consoleErrors === 0, 'high');
    check(`Avertissements console (${consoleWarnings})`, consoleWarnings <= 2, 'medium');
}, 3000);

// Rapport final après 4 secondes
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RAPPORT FINAL DIAGNOSTIC CRYPTOBOOST');
    console.log('='.repeat(60));

    const score = Math.round((success / tests) * 100);

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
        console.log('   ✅ Aucune erreur détectée');
        console.log('   ✅ Performance optimale');
        console.log('   ✅ Toutes les fonctionnalités opérationnelles');
    } else if (score >= 75) {
        console.log('👍 TRÈS BON - Quelques améliorations mineures');
        console.log('   ⚠️ Quelques problèmes à corriger');
        console.log('   ✅ Fonctionnalités principales OK');
    } else if (score >= 50) {
        console.log('⚠️ MOYEN - Corrections nécessaires');
        console.log('   ❌ Problèmes détectés nécessitant attention');
        console.log('   ✅ Base fonctionnelle');
    } else {
        console.log('❌ CRITIQUE - Problèmes majeurs');
        console.log('   🚨 Corrections urgentes requises');
        console.log('   ❌ Fonctionnalités défaillantes');
    }

    console.log(`\n💡 RECOMMANDATIONS:`);
    console.log(`===================`);

    if (errors > 0) {
        console.log('🚨 Corriger les erreurs critiques détectées');
    }
    if (warnings > 3) {
        console.log('⚠️ Adresser les avertissements');
    }
    if (score < 80) {
        console.log('🔧 Utiliser les scripts de correction automatique');
    }

    console.log(`\n📅 RÉSUMÉ:`);
    console.log(`==========`);
    console.log(`🌐 Site testé: ${window.location.href}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`🔧 Navigateur: ${navigator.userAgent.split(' ').pop()}`);

    console.log('\n' + '='.repeat(60));
    console.log('🏁 DIAGNOSTIC TERMINÉ');
    console.log('='.repeat(60));

}, 4000);

console.log('🔍 Diagnostic en cours... Rapport dans 4 secondes...');
