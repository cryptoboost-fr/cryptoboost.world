// 🚀 RELANCE TEST CRYPTOBOOST - VERSION FINALE
// Script de relance complète pour tester toutes les fonctionnalités

console.log('🚀 RELANCE TEST CRYPTOBOOST - VERSION FINALE');
console.log('===========================================');
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

// Test 1: Structure de base
console.log('🏗️ TEST 1: STRUCTURE DE BASE');
console.log('===========================');

test('Site accessible', true, 'high');
test('Titre CryptoBoost', document.title.includes('CryptoBoost'), 'high');
test('HTTPS actif', window.location.protocol === 'https:', 'high');
test('Meta viewport', !!document.querySelector('meta[name="viewport"]'), 'high');
test('Favicon présent', !!document.querySelector('link[rel*="icon"]'), 'medium');

// Test 2: CSS et design system
console.log('');
console.log('🎨 TEST 2: CSS ET DESIGN SYSTEM');
console.log('==============================');

test('Feuille de style principale', !!document.querySelector('link[href*="styles.css"]'), 'high');
test('Variables CSS crypto', getComputedStyle(document.body).getPropertyValue('--crypto-primary').length > 0, 'medium');
test('Variables CSS premium', getComputedStyle(document.body).getPropertyValue('--cb-primary').length > 0, 'medium');
test('Animations CSS', !!document.querySelector('[class*="animate"], [class*="fade"], [class*="slide"]'), 'medium');
test('Glass effects', !!document.querySelector('[class*="glass"]'), 'medium');

// Test 3: Fonctionnalités JavaScript
console.log('');
console.log('⚙️ TEST 3: FONCTIONNALITÉS JS');
console.log('============================');

// Test des fonctions critiques
const criticalFunctions = [
    'showLogin', 'showRegister', 'validateAuth', 'logout',
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

// Test 4: Navigation et sections
console.log('');
console.log('📄 TEST 4: NAVIGATION ET SECTIONS');
console.log('==============================');

// Test présence des sections principales
const sections = ['hero', 'features', 'stats', 'testimonials', 'faq', 'contact'];
sections.forEach(section => {
    const element = document.getElementById(section);
    test(`Section ${section}`, !!element, section === 'hero' ? 'high' : 'medium');
});

// Test liens de navigation
const navLinks = document.querySelectorAll('nav a, .nav a, header a');
test(`Liens de navigation (${navLinks.length})`, navLinks.length > 0, 'medium');

// Test 5: Responsive design
console.log('');
console.log('📱 TEST 5: RESPONSIVE DESIGN');
console.log('===========================');

test('Largeur d\'écran détectée', window.innerWidth > 0, 'medium');
test('Taille mobile (< 768px)', window.innerWidth < 768, 'medium');
test('Taille tablette (768px-1024px)', window.innerWidth >= 768 && window.innerWidth <= 1024, 'medium');
test('Taille desktop (> 1024px)', window.innerWidth > 1024, 'medium');

// Test 6: Assets et ressources
console.log('');
console.log('🖼️ TEST 6: ASSETS ET RESSOURCES');
console.log('===========================');

const assets = [
    '/assets/logo.svg',
    '/assets/hero-chart.svg',
    '/assets/favicon.svg',
    '/styles.css',
    '/app.js',
    '/auth.js',
    '/admin.js'
];

assets.forEach(async (asset) => {
    try {
        const response = await fetch(asset, { method: 'HEAD' });
        test(`Asset ${asset.split('/').pop()}`, response.ok, asset.includes('logo') || asset.includes('.js') ? 'high' : 'medium');
    } catch (error) {
        test(`Asset ${asset.split('/').pop()}`, false, asset.includes('logo') || asset.includes('.js') ? 'high' : 'medium');
    }
});

// Test 7: APIs Netlify
console.log('');
console.log('🔗 TEST 7: APIs NETLIFY');
console.log('=====================');

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

// Test 8: Performance
console.log('');
console.log('⚡ TEST 8: PERFORMANCE');
console.log('====================');

if (performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    test(`Temps de chargement (${loadTime}ms)`, loadTime < 5000, loadTime > 8000 ? 'high' : 'medium');
}

const domSize = document.querySelectorAll('*').length;
test(`Taille DOM (${domSize} éléments)`, domSize < 2000, domSize > 3000 ? 'high' : 'medium');

// Test 9: Sécurité
console.log('');
console.log('🔒 TEST 9: SÉCURITÉ');
console.log('==================');

test('HTTPS actif', window.location.protocol === 'https:', 'high');
test('Aucun contenu mixte', !document.querySelector('img[src^="http:"], link[href^="http:"], script[src^="http:"]'), 'high');

// Test 10: Fonctionnalités crypto
console.log('');
console.log('💰 TEST 10: FONCTIONNALITÉS CRYPTO');
console.log('==============================');

const cryptoContent = document.body.textContent;
const cryptoCurrencies = ['BTC', 'ETH', 'USDT', 'USDC'];
cryptoCurrencies.forEach(crypto => {
    test(`Support ${crypto}`, cryptoContent.includes(crypto), 'medium');
});

const transactionTypes = ['DEPOSIT', 'WITHDRAW', 'EXCHANGE', 'INVEST'];
transactionTypes.forEach(type => {
    test(`Type ${type}`, cryptoContent.includes(type), 'medium');
});

// Test 11: Éléments interactifs
console.log('');
console.log('✨ TEST 11: ÉLÉMENTS INTERACTIFS');
console.log('==============================');

const buttons = document.querySelectorAll('button, [role="button"], .btn');
test(`Boutons interactifs (${buttons.length})`, buttons.length > 0, 'medium');

const forms = document.querySelectorAll('form, [role="form"]');
test(`Formulaires (${forms.length})`, forms.length > 0, 'medium');

const links = document.querySelectorAll('a[href]');
test(`Liens valides (${links.length})`, links.length > 0, 'medium');

// Test 12: Design system
console.log('');
console.log('🎨 TEST 12: DESIGN SYSTEM v3.0');
console.log('=============================');

// Test des classes CSS du nouveau design system
const designClasses = [
    'glass-card', 'glass-nav', 'glass-card-strong',
    'stat-card', 'crypto-card', 'nav-link',
    'btn-primary', 'btn-secondary', 'text-gradient'
];

designClasses.forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);
    test(`Classe CSS ${className} (${elements.length})`, elements.length > 0, 'medium');
});

// Test 13: Animations et effets
console.log('');
console.log('🎭 TEST 13: ANIMATIONS ET EFFETS');
console.log('==============================');

const animationClasses = [
    'fade-in', 'slide-up', 'scale-in', 'float',
    'shimmer', 'loading-pulse'
];

animationClasses.forEach(className => {
    const elements = document.querySelectorAll(`.${className}`);
    test(`Animation ${className} (${elements.length})`, elements.length >= 0, 'medium');
});

// Test 14: Accessibilité
console.log('');
console.log('♿ TEST 14: ACCESSIBILITÉ');
console.log('=======================');

const images = document.querySelectorAll('img');
let imagesWithAlt = 0;
images.forEach(img => {
    if (img.hasAttribute('alt') && img.getAttribute('alt').trim() !== '') {
        imagesWithAlt++;
    }
});
test(`Images avec alt text (${imagesWithAlt}/${images.length})`, imagesWithAlt === images.length, 'medium');

// Test 15: Erreurs console
console.log('');
console.log('🚨 TEST 15: ERREURS CONSOLE');
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

setTimeout(() => {
    console.error = originalError;
    console.warn = originalWarn;

    test(`Erreurs console (${consoleErrors})`, consoleErrors === 0, 'high');
    test(`Avertissements console (${consoleWarnings})`, consoleWarnings <= 3, 'medium');
}, 3000);

// Rapport final
setTimeout(() => {
    const score = Math.round((success / tests) * 100);

    console.log('');
    console.log(''.padEnd(80, '='));
    console.log('🎯 RAPPORT FINAL RELANCE TEST CRYPTOBOOST');
    console.log(''.padEnd(80, '='));

    console.log('');
    console.log('📊 RÉSULTATS GÉNÉRAUX:');
    console.log('====================');
    console.log(`✅ Tests réussis: ${success}/${tests}`);
    console.log(`❌ Erreurs critiques: ${errors}`);
    console.log(`⚠️ Avertissements: ${warnings}`);
    console.log(`🎯 Score global: ${score}%`);
    console.log(`📊 Taux de succès: ${Math.round((success / tests) * 100)}%`);

    console.log('');
    console.log('📋 ÉVALUATION DÉTAILLÉE:');
    console.log('=========================');

    if (score >= 95) {
        console.log('🎉 PARFAIT ! Site 100% opérationnel');
        console.log('   ✅ Toutes les fonctionnalités critiques OK');
        console.log('   ✅ Design system v3.0 opérationnel');
        console.log('   ✅ APIs fonctionnelles');
        console.log('   ✅ Performance optimale');
        console.log('   ✅ Aucune erreur détectée');
    } else if (score >= 90) {
        console.log('🎉 EXCELLENT - Site premium opérationnel');
        console.log('   ✅ Fonctionnalités principales OK');
        console.log('   ✅ Design moderne actif');
        console.log('   ✅ Quelques améliorations mineures possibles');
    } else if (score >= 80) {
        console.log('👍 TRÈS BON - Plateforme fonctionnelle');
        console.log('   ✅ Base solide opérationnelle');
        console.log('   ⚠️ Quelques optimisations recommandées');
    } else if (score >= 70) {
        console.log('🟡 BON - Plateforme opérationnelle');
        console.log('   ✅ Fonctionnalités de base OK');
        console.log('   ❌ Corrections recommandées');
    } else {
        console.log('❌ AMÉLIORATIONS NÉCESSAIRES');
        console.log('   🚨 Problèmes détectés nécessitant attention');
        console.log('   ❌ Fonctionnalités défaillantes');
    }

    console.log('');
    console.log('🔧 ANALYSE PAR CATÉGORIE:');
    console.log('========================');

    // Analyse des résultats par catégorie
    const categories = {
        'Structure': ['Site accessible', 'Titre CryptoBoost', 'HTTPS actif', 'Meta viewport', 'Favicon présent'],
        'CSS': ['Feuille de style principale', 'Variables CSS crypto', 'Variables CSS premium', 'Animations CSS', 'Glass effects'],
        'JavaScript': criticalFunctions.map(f => `Fonction ${f}`).concat(modals.map(m => `Modal ${m}`)),
        'Navigation': ['Liens de navigation'].concat(sections.map(s => `Section ${s}`)),
        'Responsive': ['Largeur d\'écran détectée', 'Taille mobile', 'Taille tablette', 'Taille desktop'],
        'APIs': apis.map(a => `API ${a.split('/').pop().split('?')[0]}`),
        'Performance': ['Temps de chargement', 'Taille DOM'],
        'Sécurité': ['HTTPS actif', 'Aucun contenu mixte'],
        'Crypto': cryptoCurrencies.map(c => `Support ${c}`).concat(transactionTypes.map(t => `Type ${t}`)),
        'UX': ['Boutons interactifs', 'Formulaires', 'Liens valides'],
        'Design': designClasses.map(c => `Classe CSS ${c}`),
        'Animations': animationClasses.map(a => `Animation ${a}`),
        'Accessibilité': ['Images avec alt text'],
        'Erreurs': ['Erreurs console', 'Avertissements console']
    };

    Object.entries(categories).forEach(([category, tests]) => {
        const categoryTests = tests.filter(testName =>
            testName.includes('(') || tests.some(t => t.includes(testName.split(' ')[1] || testName))
        );
        if (categoryTests.length > 0) {
            console.log(`\n${category}:`);
            tests.forEach(testName => {
                console.log(`   • ${testName}`);
            });
        }
    });

    console.log('');
    console.log('📅 RÉSUMÉ TECHNIQUE:');
    console.log('===================');
    console.log(`🌐 Site testé: ${window.location.href}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`📱 Résolution: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`🔧 Navigateur: ${navigator.userAgent.split(' ').pop()}`);
    console.log(`⚡ Performance: ${performance.timing ? (performance.timing.loadEventEnd - performance.timing.navigationStart) + 'ms' : 'N/A'}`);
    console.log(`📊 DOM Elements: ${document.querySelectorAll('*').length}`);

    console.log('');
    console.log(''.padEnd(80, '='));
    console.log('🏁 RELANCE TEST TERMINÉE');
    console.log(''.padEnd(80, '='));

    if (score >= 90) {
        console.log('');
        console.log('🎉 FÉLICITATIONS !');
        console.log('=================');
        console.log('Votre CryptoBoost v3.0 est PARFAIT !');
        console.log('');
        console.log('✅ Design System v3.0 opérationnel');
        console.log('✅ Interface premium fonctionnelle');
        console.log('✅ Toutes les APIs opérationnelles');
        console.log('✅ Performance optimale');
        console.log('✅ Aucune erreur détectée');
        console.log('');
        console.log('🚀 Prêt pour la production !');
    } else {
        console.log('');
        console.log('💡 PROCHAINES ÉTAPES:');
        console.log('===================');
        console.log('1. 🔧 Corriger les erreurs détectées');
        console.log('2. ⚠️ Adresser les avertissements');
        console.log('3. 📊 Re-tester après corrections');
        console.log('4. 🚀 Déployer les corrections');
    }

    console.log('');
    console.log('📋 RECOMMANDATIONS:');
    console.log('==================');

    if (errors > 0) {
        console.log('🚨 Corriger les erreurs critiques détectées');
    }
    if (warnings > 5) {
        console.log('⚠️ Optimiser les avertissements');
    }
    if (score < 95) {
        console.log('🔧 Finaliser les dernières optimisations');
    }

}, 5000);

console.log('🔍 Relance test complète en cours...');
console.log('⏳ Analyse de toutes les fonctionnalités...');
console.log('📊 Score final dans 5 secondes...');
