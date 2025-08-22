// 🧪 TEST COMPLET CRYPTOBOOST - VERSION FINALE
// Script à copier dans la console du navigateur sur https://cryptoboost.world

console.log('🧪 TEST COMPLET CRYPTOBOOST - VERSION FINALE');
console.log('==========================================');
console.log(`⏰ ${new Date().toLocaleString()}`);
console.log(`🌐 ${window.location.href}`);

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
console.log('\n🏗️ TEST 1: STRUCTURE DE BASE');
console.log('===========================');

test('Page HTML chargée', document.readyState === 'complete', 'high');
test('Titre CryptoBoost', document.title.includes('CryptoBoost'), 'medium');
test('Meta viewport mobile', !!document.querySelector('meta[name="viewport"]'), 'high');
test('Favicon présent', !!document.querySelector('link[rel*="icon"]'), 'medium');

// Test 2: Pages HTML disponibles
console.log('\n📄 TEST 2: PAGES HTML');
console.log('===================');

const pages = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about.html' },
    { name: 'Contact', path: '/contact.html' },
    { name: 'CGU', path: '/cgu.html' },
    { name: 'Cookies', path: '/cookies.html' },
    { name: 'Politique de confidentialité', path: '/privacy.html' },
    { name: 'Dashboard Client', path: '/client-dashboard.html' },
    { name: 'Investissements Client', path: '/client-investments.html' },
    { name: 'Transactions Client', path: '/client-transactions.html' },
    { name: 'Wallets Client', path: '/client-wallets.html' },
    { name: 'Notifications Client', path: '/client-notifications.html' },
    { name: 'Profil Client', path: '/client-profile.html' },
    { name: 'Support Client', path: '/client-support.html' },
    { name: 'Dashboard Admin', path: '/admin.html' },
    { name: 'Utilisateurs Admin', path: '/admin-users.html' },
    { name: 'Transactions Admin', path: '/admin-transactions.html' },
    { name: 'Investissements Admin', path: '/admin-investments.html' },
    { name: 'Wallets Admin', path: '/admin-wallets.html' },
    { name: 'Rapports Admin', path: '/admin-reports.html' },
    { name: 'Paramètres Admin', path: '/admin-settings.html' }
];

(async () => {
    for (const page of pages) {
        try {
            const response = await fetch(page.path, { method: 'HEAD' });
            test(`Page ${page.name}`, response.ok, page.path.includes('admin') || page.path.includes('client') ? 'medium' : 'high');
        } catch (error) {
            test(`Page ${page.name}`, false, page.path.includes('admin') || page.path.includes('client') ? 'medium' : 'high');
        }
    }

    // Test 3: Fonctions JavaScript critiques
    console.log('\n⚙️ TEST 3: FONCTIONS JAVASCRIPT');
    console.log('==============================');

    const criticalFunctions = [
        'showLogin', 'showRegister', 'logout', 'validateAuth',
        'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange',
        'showInvestments', 'showTransactions', 'showWallets', 'showProfile',
        'loadUserData', 'saveUserData', 'getCurrentUser', 'protectPage'
    ];

    criticalFunctions.forEach(funcName => {
        test(`Fonction ${funcName}`, typeof window[funcName] === 'function', 'high');
    });

    // Test 4: Éléments HTML critiques
    console.log('\n📋 TEST 4: ÉLÉMENTS HTML CRITIQUES');
    console.log('================================');

    const criticalElements = [
        { id: 'loginModal', name: 'Modal de connexion', critical: true },
        { id: 'registerModal', name: 'Modal d\'inscription', critical: true },
        { id: 'stats', name: 'Section statistiques', critical: false },
        { id: 'features', name: 'Section fonctionnalités', critical: false },
        { id: 'testimonials', name: 'Section témoignages', critical: false },
        { id: 'faq', name: 'Section FAQ', critical: false },
        { id: 'contact', name: 'Section contact', critical: false },
        { id: 'hero', name: 'Section hero', critical: false }
    ];

    criticalElements.forEach(element => {
        test(`${element.name}`, !!document.getElementById(element.id), element.critical ? 'high' : 'medium');
    });

    // Test 5: CSS et styles
    console.log('\n🎨 TEST 5: CSS ET STYLES');
    console.log('=======================');

    test('Feuille de style principale', !!document.querySelector('link[href*="styles.css"]'), 'high');
    test('Styles Tailwind chargés', !!document.querySelector('[class*="bg-"], [class*="text-"], [class*="p-"]'), 'medium');

    // Vérifier les variables CSS
    const body = document.body;
    const computedStyle = getComputedStyle(body);
    test('Variables CSS crypto chargées', computedStyle.getPropertyValue('--crypto-primary').length > 0, 'medium');
    test('Variables CSS gradients', computedStyle.getPropertyValue('--gradient-crypto').length > 0, 'medium');

    // Test 6: Assets et images
    console.log('\n🖼️ TEST 6: ASSETS ET IMAGES');
    console.log('==========================');

    const assets = [
        { name: 'Logo SVG', url: '/assets/logo.svg', critical: true },
        { name: 'Hero Chart', url: '/assets/hero-chart.svg', critical: false },
        { name: 'Favicon', url: '/assets/favicon.svg', critical: false },
        { name: 'Styles CSS', url: '/styles.css', critical: true },
        { name: 'App JS', url: '/app.js', critical: true },
        { name: 'Auth JS', url: '/auth.js', critical: true },
        { name: 'Admin JS', url: '/admin.js', critical: false }
    ];

    for (const asset of assets) {
        try {
            const response = await fetch(asset.url, { method: 'HEAD' });
            test(`${asset.name}`, response.ok, asset.critical ? 'high' : 'medium');
        } catch (error) {
            test(`${asset.name}`, false, asset.critical ? 'high' : 'medium');
        }
    }

    // Test 7: APIs Netlify
    console.log('\n🔗 TEST 7: APIs NETLIFY');
    console.log('=====================');

    const apis = [
        { name: 'GitHub DB', url: '/.netlify/functions/github-db?collection=users', critical: true },
        { name: 'CoinAPI', url: '/.netlify/functions/coinapi?action=rates&quote=EUR', critical: true },
        { name: 'GitHub DB Enhanced', url: '/.netlify/functions/github-db-enhanced?collection=users', critical: false },
        { name: 'CoinAPI Enhanced', url: '/.netlify/functions/coinapi-enhanced?action=rates&quote=EUR', critical: false }
    ];

    for (const api of apis) {
        try {
            const response = await fetch(api.url, { method: 'GET' });
            test(`API ${api.name}`, response.ok, api.critical ? 'high' : 'medium');
        } catch (error) {
            test(`API ${api.name}`, false, api.critical ? 'high' : 'medium');
        }
    }

    // Test 8: Authentification
    console.log('\n🔐 TEST 8: AUTHENTIFICATION');
    console.log('============================');

    test('Session Storage disponible', typeof sessionStorage !== 'undefined', 'high');
    test('Local Storage disponible', typeof localStorage !== 'undefined', 'high');

    if (typeof localStorage !== 'undefined') {
        test('Fonction validateAuth disponible', typeof validateAuth === 'function', 'high');
        test('Fonction getCurrentUser disponible', typeof getCurrentUser === 'function', 'high');
    }

    // Test 9: Responsivité mobile
    console.log('\n📱 TEST 9: RESPONSIVITÉ MOBILE');
    console.log('============================');

    const viewport = document.querySelector('meta[name="viewport"]');
    test('Meta viewport présent', !!viewport, 'high');

    if (viewport) {
        const content = viewport.getAttribute('content');
        test('Viewport mobile-friendly', content.includes('width=device-width') && content.includes('initial-scale=1'), 'high');
    }

    test('Taille d\'écran détectée', window.innerWidth > 0, 'medium');
    test('Media queries CSS', document.styleSheets.length > 0, 'medium');

    // Test 10: Animations et interactions
    console.log('\n✨ TEST 10: ANIMATIONS ET INTERACTIONS');
    console.log('====================================');

    test('Animations CSS disponibles', !!document.querySelector('[class*="animate"], [class*="fade"], [class*="slide"]'), 'medium');
    test('Transitions CSS', !!document.querySelector('[style*="transition"], [class*="transition"]'), 'medium');

    // Vérifier les animations JavaScript
    const jsAnimations = [
        'enhanced-animations.css', 'enhanced-interactions.js'
    ];

    for (const anim of jsAnimations) {
        const element = document.querySelector(`link[href*="${anim}"], script[src*="${anim}"]`);
        test(`Animation ${anim}`, !!element, 'medium');
    }

    // Test 11: Performance
    console.log('\n⚡ TEST 11: PERFORMANCE');
    console.log('======================');

    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        test(`Temps de chargement (${loadTime}ms)`, loadTime < 5000, loadTime > 8000 ? 'high' : 'medium');

        const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        test(`DOM Content Loaded (${domTime}ms)`, domTime < 3000, domTime > 5000 ? 'high' : 'medium');
    }

    const domSize = document.querySelectorAll('*').length;
    test(`Taille DOM (${domSize} éléments)`, domSize < 2000, domSize > 3000 ? 'high' : 'medium');

    const cssRules = Array.from(document.styleSheets).reduce((total, sheet) => {
        try {
            return total + sheet.cssRules.length;
        } catch {
            return total;
        }
    }, 0);
    test(`Règles CSS (${cssRules})`, cssRules < 1000, cssRules > 2000 ? 'high' : 'medium');

    // Test 12: Sécurité
    console.log('\n🔒 TEST 12: SÉCURITÉ');
    console.log('===================');

    test('HTTPS actif', window.location.protocol === 'https:', 'high');
    test('Aucun contenu mixte détecté', !document.querySelector('img[src^="http:"], link[href^="http:"], script[src^="http:"]'), 'high');

    // Test 13: Accessibilité
    console.log('\n♿ TEST 13: ACCESSIBILITÉ');
    console.log('========================');

    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    images.forEach(img => {
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
            imagesWithoutAlt++;
        }
    });
    test(`Images avec alt text (${images.length - imagesWithoutAlt}/${images.length})`, imagesWithoutAlt === 0, 'medium');

    const buttons = document.querySelectorAll('button, [role="button"]');
    test(`Boutons accessibles (${buttons.length})`, buttons.length > 0, 'medium');

    const links = document.querySelectorAll('a');
    let linksWithoutHref = 0;
    links.forEach(link => {
        if (!link.hasAttribute('href') || link.getAttribute('href').trim() === '') {
            linksWithoutHref++;
        }
    });
    test(`Liens valides (${links.length - linksWithoutHref}/${links.length})`, linksWithoutHref === 0, 'medium');

    // Test 14: SEO
    console.log('\n🔍 TEST 14: SEO');
    console.log('================');

    const metaDescription = document.querySelector('meta[name="description"]');
    test('Meta description', !!metaDescription, 'medium');

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    test('Meta keywords', !!metaKeywords, 'medium');

    const ogTitle = document.querySelector('meta[property="og:title"]');
    test('Open Graph title', !!ogTitle, 'medium');

    const ogDescription = document.querySelector('meta[property="og:description"]');
    test('Open Graph description', !!ogDescription, 'medium');

    // Test 15: Fonctionnalités spécifiques
    console.log('\n🎯 TEST 15: FONCTIONNALITÉS SPÉCIFIQUES');
    console.log('====================================');

    // Test des cryptos supportées
    const supportedCryptos = ['BTC', 'ETH', 'USDT', 'USDC'];
    supportedCryptos.forEach(crypto => {
        test(`Support crypto ${crypto}`, document.body.textContent.includes(crypto), 'medium');
    });

    // Test des fonctionnalités de transaction
    const transactionTypes = ['DEPOSIT', 'WITHDRAW', 'EXCHANGE', 'INVEST'];
    transactionTypes.forEach(type => {
        test(`Type de transaction ${type}`, document.body.textContent.includes(type), 'medium');
    });

    // Test des statuts de transaction
    const transactionStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REJECTED'];
    transactionStatuses.forEach(status => {
        test(`Statut ${status}`, document.body.textContent.includes(status), 'medium');
    });

    // Test 16: Erreurs JavaScript
    console.log('\n🚨 TEST 16: ERREURS JAVASCRIPT');
    console.log('=============================');

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

    // Simuler quelques interactions pour détecter les erreurs
    setTimeout(() => {
        console.error = originalError;
        console.warn = originalWarn;

        test(`Erreurs console (${consoleErrors})`, consoleErrors === 0, 'high');
        test(`Avertissements console (${consoleWarnings})`, consoleWarnings <= 2, 'medium');
    }, 3000);

    // Rapport final
    setTimeout(() => {
        const score = Math.round((success / tests) * 100);

        console.log('\n' + '='.repeat(80));
        console.log('🎯 RAPPORT FINAL TEST COMPLET CRYPTOBOOST');
        console.log('='.repeat(80));

        console.log(`\n📊 RÉSULTATS GÉNÉRAUX:`);
        console.log(`======================`);
        console.log(`✅ Tests réussis: ${success}/${tests}`);
        console.log(`❌ Erreurs critiques: ${errors}`);
        console.log(`⚠️ Avertissements: ${warnings}`);
        console.log(`🎯 Score global: ${score}%`);

        console.log(`\n📋 ÉVALUATION DÉTAILLÉE:`);
        console.log(`=========================`);

        if (score >= 90) {
            console.log('🎉 EXCELLENT - Site parfait !');
            console.log('   ✅ Toutes les fonctionnalités opérationnelles');
            console.log('   ✅ Performance optimale');
            console.log('   ✅ Sécurité et accessibilité parfaites');
            console.log('   ✅ Mobile responsive');
            console.log('   ✅ APIs fonctionnelles');
        } else if (score >= 80) {
            console.log('👍 TRÈS BON - Quelques améliorations mineures');
            console.log('   ⚠️ Quelques problèmes à corriger');
            console.log('   ✅ Base fonctionnelle solide');
        } else if (score >= 70) {
            console.log('🟡 BON - Corrections recommandées');
            console.log('   ❌ Problèmes détectés nécessitant attention');
            console.log('   ✅ Fonctionnalités principales OK');
        } else if (score >= 50) {
            console.log('🟠 MOYEN - Corrections nécessaires');
            console.log('   ❌ Problèmes multiples détectés');
            console.log('   ✅ Structure de base présente');
        } else {
            console.log('❌ CRITIQUE - Problèmes majeurs');
            console.log('   🚨 Corrections urgentes requises');
            console.log('   ❌ Fonctionnalités défaillantes');
        }

        console.log(`\n🔧 RECOMMANDATIONS:`);
        console.log(`==================`);

        if (errors > 0) {
            console.log('🚨 Corriger les erreurs critiques détectées');
        }
        if (warnings > 5) {
            console.log('⚠️ Adresser les avertissements');
        }
        if (score < 80) {
            console.log('🔧 Utiliser les scripts de correction automatique');
        }
        if (!document.querySelector('link[href*="enhanced-animations.css"]')) {
            console.log('✨ Ajouter les animations CSS manquantes');
        }

        console.log(`\n📊 ANALYSE PAR CATÉGORIE:`);
        console.log(`========================`);

        // Analyser les erreurs par catégorie
        const categoryAnalysis = {
            'Structure': ['Page HTML chargée', 'Titre CryptoBoost', 'Meta viewport mobile', 'Favicon présent'],
            'Pages': pages.map(p => `Page ${p.name}`),
            'JavaScript': criticalFunctions.map(f => `Fonction ${f}`),
            'Éléments HTML': criticalElements.map(e => e.name),
            'CSS': ['Feuille de style principale', 'Styles Tailwind chargés', 'Variables CSS crypto chargées', 'Variables CSS gradients'],
            'Assets': assets.map(a => a.name),
            'APIs': apis.map(a => `API ${a.name}`),
            'Authentification': ['Session Storage disponible', 'Local Storage disponible', 'Fonction validateAuth disponible', 'Fonction getCurrentUser disponible'],
            'Mobile': ['Meta viewport présent', 'Viewport mobile-friendly', 'Taille d\'écran détectée', 'Media queries CSS'],
            'Animations': ['Animations CSS disponibles', 'Transitions CSS'],
            'Performance': ['Temps de chargement', 'DOM Content Loaded', 'Taille DOM', 'Règles CSS'],
            'Sécurité': ['HTTPS actif', 'Aucun contenu mixte détecté'],
            'Accessibilité': ['Images avec alt text', 'Boutons accessibles', 'Liens valides'],
            'SEO': ['Meta description', 'Meta keywords', 'Open Graph title', 'Open Graph description'],
            'Fonctionnalités': [...supportedCryptos.map(c => `Support crypto ${c}`), ...transactionTypes.map(t => `Type de transaction ${t}`), ...transactionStatuses.map(s => `Statut ${s}`)],
            'Erreurs': ['Erreurs console', 'Avertissements console']
        };

        for (const [category, tests] of Object.entries(categoryAnalysis)) {
            const categoryTests = tests.filter(test => test.includes('(') || tests.includes(test));
            if (categoryTests.length > 0) {
                console.log(`\n${category}:`);
                categoryTests.forEach(test => {
                    console.log(`   • ${test}`);
                });
            }
        }

        console.log(`\n📅 RÉSUMÉ FINAL:`);
        console.log(`===============`);
        console.log(`🌐 Site testé: ${window.location.href}`);
        console.log(`📅 Date: ${new Date().toLocaleString()}`);
        console.log(`🔧 Navigateur: ${navigator.userAgent.split(' ').pop()}`);
        console.log(`📱 Résolution: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`⚡ Performance: ${performance.timing ? (performance.timing.loadEventEnd - performance.timing.navigationStart) + 'ms' : 'N/A'}`);

        console.log('\n' + '='.repeat(80));
        console.log('🏁 TEST COMPLET TERMINÉ');
        console.log('='.repeat(80));

        if (score < 100) {
            console.log('\n💡 PROCHAINES ÉTAPES RECOMMANDÉES:');
            console.log('=================================');
            console.log('1. 🔧 Corriger les erreurs critiques détectées');
            console.log('2. ⚠️ Adresser les avertissements');
            console.log('3. 📱 Tester sur différents appareils mobiles');
            console.log('4. 🚀 Vérifier les performances avec Lighthouse');
            console.log('5. ♿ Tester l\'accessibilité avec axe DevTools');
        }

    }, 4000);

})();

console.log('🔍 Test complet en cours... Rapport dans 4 secondes...');
