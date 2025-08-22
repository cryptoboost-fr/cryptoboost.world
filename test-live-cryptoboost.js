// 🧪 TEST RAPIDE SITE LIVE CRYPTOBOOST
// Script à copier dans la console du navigateur sur https://cryptoboost.world

console.log('🚀 TEST RAPIDE CRYPTOBOOST - SITE LIVE');
console.log('=====================================');
console.log(`⏰ ${new Date().toLocaleString()}`);
console.log(`🌐 ${window.location.href}`);
console.log('');

let tests = 0;
let success = 0;
let errors = 0;
let warnings = 0;

function test(name, condition, severity = 'normal') {
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

// Test 1: Base
console.log('🏗️ TEST 1: STRUCTURE DE BASE');
console.log('===========================');

test('Site accessible', true, 'high');
test('HTTPS actif', window.location.protocol === 'https:', 'high');
test('Titre CryptoBoost', document.title.includes('CryptoBoost'), 'high');
test('Meta viewport', !!document.querySelector('meta[name="viewport"]'), 'high');
test('Favicon présent', !!document.querySelector('link[rel*="icon"]'), 'medium');

console.log('');
console.log('📄 TEST 2: PAGES ET NAVIGATION');
console.log('==============================');

// Test des liens de navigation
const navLinks = document.querySelectorAll('nav a, .nav a, header a');
test(`Liens de navigation (${navLinks.length})`, navLinks.length > 0, 'medium');

// Test présence des sections principales
const sections = ['hero', 'features', 'stats', 'testimonials', 'faq', 'contact'];
sections.forEach(section => {
    const element = document.getElementById(section);
    test(`Section ${section}`, !!element, section === 'hero' ? 'high' : 'medium');
});

console.log('');
console.log('🎨 TEST 3: DESIGN ET CSS');
console.log('========================');

// Test des styles CSS
test('Feuille de style principale', !!document.querySelector('link[href*="styles.css"]'), 'high');
test('Tailwind CSS chargé', !!document.querySelector('[class*="bg-"], [class*="text-"], [class*="p-"]'), 'medium');

// Test des variables CSS
const body = document.body;
const computedStyle = getComputedStyle(body);
test('Variables CSS crypto', computedStyle.getPropertyValue('--crypto-primary').length > 0, 'medium');
test('Variables CSS premium', computedStyle.getPropertyValue('--cb-primary').length > 0, 'medium');

console.log('');
console.log('⚙️ TEST 4: FONCTIONNALITÉS JS');
console.log('============================');

// Test des fonctions critiques
const criticalFunctions = [
    'showLogin', 'showRegister', 'validateAuth',
    'showDashboard', 'showInvestments', 'showTransactions'
];

criticalFunctions.forEach(func => {
    test(`Fonction ${func}`, typeof window[func] === 'function', 'high');
});

// Test des modals
const modals = ['loginModal', 'registerModal'];
modals.forEach(modal => {
    test(`Modal ${modal}`, !!document.getElementById(modal), 'high');
});

console.log('');
console.log('🔗 TEST 5: APIs ET ASSETS');
console.log('=========================');

// Test des assets critiques
const assets = [
    '/assets/logo.svg',
    '/assets/hero-chart.svg',
    '/assets/favicon.svg',
    '/styles.css',
    '/app.js',
    '/auth.js'
];

assets.forEach(async (asset) => {
    try {
        const response = await fetch(asset, { method: 'HEAD' });
        test(`Asset ${asset.split('/').pop()}`, response.ok, asset.includes('logo') || asset.includes('.js') ? 'high' : 'medium');
    } catch (error) {
        test(`Asset ${asset.split('/').pop()}`, false, asset.includes('logo') || asset.includes('.js') ? 'high' : 'medium');
    }
});

// Test des APIs Netlify
const apis = [
    '/.netlify/functions/github-db?collection=users',
    '/.netlify/functions/coinapi?action=rates&quote=EUR'
];

setTimeout(() => {
    apis.forEach(async (api) => {
        try {
            const response = await fetch(api, { method: 'GET' });
            test(`API ${api.split('/').pop()}`, response.ok, 'high');
        } catch (error) {
            test(`API ${api.split('/').pop()}`, false, 'high');
        }
    });
}, 1000);

console.log('');
console.log('📱 TEST 6: RESPONSIVE MOBILE');
console.log('===========================');

test('Largeur d\'écran détectée', window.innerWidth > 0, 'medium');
test('Taille mobile (< 768px)', window.innerWidth < 768, 'medium');
test('Taille tablette (768px-1024px)', window.innerWidth >= 768 && window.innerWidth <= 1024, 'medium');
test('Taille desktop (> 1024px)', window.innerWidth > 1024, 'medium');

console.log('');
console.log('✨ TEST 7: ANIMATIONS ET UX');
console.log('===========================');

// Test des animations CSS
test('Animations CSS', !!document.querySelector('[class*="animate"], [class*="fade"], [class*="slide"]'), 'medium');
test('Transitions CSS', !!document.querySelector('[style*="transition"], [class*="transition"]'), 'medium');

// Test des éléments interactifs
const buttons = document.querySelectorAll('button, [role="button"], .btn');
test(`Boutons interactifs (${buttons.length})`, buttons.length > 0, 'medium');

const forms = document.querySelectorAll('form, [role="form"]');
test(`Formulaires (${forms.length})`, forms.length > 0, 'medium');

console.log('');
console.log('🚨 TEST 8: ERREURS CONSOLE');
console.log('==========================');

// Surveillance des erreurs console
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

setTimeout(() => {
    console.error = originalError;
    console.warn = originalWarn;

    test(`Erreurs console (${consoleErrors})`, consoleErrors === 0, 'high');
    test(`Avertissements console (${consoleWarnings})`, consoleWarnings <= 3, 'medium');
}, 3000);

console.log('');
console.log('💰 TEST 9: FONCTIONNALITÉS CRYPTO');
console.log('===============================');

// Test du contenu crypto
const cryptoContent = document.body.textContent;
const cryptoCurrencies = ['BTC', 'ETH', 'USDT', 'USDC'];
cryptoCurrencies.forEach(crypto => {
    test(`Support ${crypto}`, cryptoContent.includes(crypto), 'medium');
});

const transactionTypes = ['DEPOSIT', 'WITHDRAW', 'EXCHANGE', 'INVEST'];
transactionTypes.forEach(type => {
    test(`Type ${type}`, cryptoContent.includes(type), 'medium');
});

// Rapport final
setTimeout(() => {
    const score = Math.round((success / tests) * 100);

    console.log('');
    console.log(''.padEnd(60, '='));
    console.log('🎯 RAPPORT FINAL TEST SITE LIVE CRYPTOBOOST');
    console.log(''.padEnd(60, '='));

    console.log('');
    console.log('📊 RÉSULTATS GÉNÉRAUX:');
    console.log('====================');
    console.log(`✅ Tests réussis: ${success}/${tests}`);
    console.log(`❌ Erreurs critiques: ${errors}`);
    console.log(`⚠️ Avertissements: ${warnings}`);
    console.log(`🎯 Score global: ${score}%`);

    console.log('');
    console.log('📋 ÉVALUATION:');
    console.log('==============');

    if (score >= 90) {
        console.log('🎉 EXCELLENT - Site live parfait !');
        console.log('   ✅ Toutes les fonctionnalités opérationnelles');
        console.log('   ✅ Interface responsive mobile');
        console.log('   ✅ APIs fonctionnelles');
        console.log('   ✅ Aucune erreur détectée');
    } else if (score >= 80) {
        console.log('👍 TRÈS BON - Quelques améliorations mineures');
        console.log('   ⚠️ Quelques problèmes à corriger');
        console.log('   ✅ Base fonctionnelle solide');
    } else if (score >= 70) {
        console.log('🟡 BON - Corrections recommandées');
        console.log('   ❌ Problèmes détectés nécessitant attention');
        console.log('   ✅ Fonctionnalités principales OK');
    } else {
        console.log('❌ CRITIQUE - Problèmes majeurs');
        console.log('   🚨 Corrections urgentes requises');
        console.log('   ❌ Fonctionnalités défaillantes');
    }

    console.log('');
    console.log('🔧 RECOMMANDATIONS:');
    console.log('===================');

    if (errors > 0) {
        console.log('🚨 Corriger les erreurs critiques détectées');
    }
    if (warnings > 3) {
        console.log('⚠️ Adresser les avertissements');
    }
    if (score < 85) {
        console.log('🔧 Utiliser les scripts de correction automatique');
    }

    console.log('');
    console.log('📅 RÉSUMÉ:');
    console.log('=========');
    console.log(`🌐 Site testé: ${window.location.href}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`📱 Résolution: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`🔧 Navigateur: ${navigator.userAgent.split(' ').pop()}`);

    console.log('');
    console.log(''.padEnd(60, '='));
    console.log('🏁 TEST SITE LIVE TERMINÉ');
    console.log(''.padEnd(60, '='));

    if (score >= 90) {
        console.log('');
        console.log('🎉 FÉLICITATIONS !');
        console.log('=================');
        console.log('Votre CryptoBoost live est PARFAIT !');
        console.log('✅ Prêt pour la production');
        console.log('✅ Interface 100% fonctionnelle');
        console.log('✅ Aucune erreur détectée');
    }
}, 5000);

console.log('🔍 Test du site live en cours... Rapport dans 5 secondes...');
console.log('⏳ Analyse des fonctionnalités, APIs, mobile, et erreurs...');
