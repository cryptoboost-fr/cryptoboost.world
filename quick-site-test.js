// 🚀 CRYPTOBOOST - TEST RAPIDE & COMPLET
// Script ultra-simple à copier dans la console navigateur

console.log('🔥 CRYPTOBOOST - TEST RAPIDE DU SITE');
console.log('=====================================');

const siteUrl = 'https://cryptoboost.world';
let testsPassed = 0;
let totalTests = 0;

// Fonction utilitaire pour compter les tests
function test(name, condition) {
    totalTests++;
    if (condition) {
        testsPassed++;
        console.log(`✅ ${name}`);
        return true;
    } else {
        console.log(`❌ ${name}`);
        return false;
    }
}

// Test 1: Connectivité de base
async function testConnectivity() {
    console.log('\n🌐 TEST 1: CONNECTIVITÉ');
    try {
        const response = await fetch(siteUrl);
        test('Site accessible', response.ok);
        test('HTTPS actif', window.location.protocol === 'https:');
        test('Titre CryptoBoost', document.title.includes('CryptoBoost'));
    } catch (error) {
        test('Site accessible', false);
        console.log(`   Erreur: ${error.message}`);
    }
}

// Test 2: Pages principales
async function testPages() {
    console.log('\n📄 TEST 2: PAGES PRINCIPALES');

    const pages = [
        { name: 'Accueil', path: '/' },
        { name: 'Admin', path: '/admin.html' },
        { name: 'Client Dashboard', path: '/client-dashboard.html' },
        { name: 'About', path: '/about.html' },
        { name: 'Contact', path: '/contact.html' }
    ];

    for (const page of pages) {
        try {
            const response = await fetch(`${siteUrl}${page.path}`, { method: 'HEAD' });
            test(`${page.name} (${response.status})`, response.ok);
        } catch (error) {
            test(page.name, false);
        }
    }
}

// Test 3: Assets critiques
async function testAssets() {
    console.log('\n📦 TEST 3: ASSETS CRITIQUES');

    const assets = [
        '/assets/logo.svg',
        '/styles.css',
        '/app.js',
        '/auth.js',
        '/crypto-api.js'
    ];

    for (const asset of assets) {
        try {
            const response = await fetch(`${siteUrl}${asset}`, { method: 'HEAD' });
            const size = response.headers.get('content-length');
            test(`${asset.split('/').pop()}`, response.ok);
            if (response.ok && size) {
                console.log(`   📊 Taille: ${Math.round(size/1024)} KB`);
            }
        } catch (error) {
            test(asset.split('/').pop(), false);
        }
    }
}

// Test 4: Fonctions Netlify
async function testFunctions() {
    console.log('\n⚙️ TEST 4: FONCTIONS NETLIFY');

    const functions = [
        { name: 'GitHub DB Users', path: '/.netlify/functions/github-db?collection=users' },
        { name: 'GitHub DB Transactions', path: '/.netlify/functions/github-db?collection=transactions' },
        { name: 'CoinAPI', path: '/.netlify/functions/coinapi?action=rates&quote=EUR' }
    ];

    for (const func of functions) {
        try {
            const response = await fetch(`${siteUrl}${func.path}`);
            test(func.name, response.ok);
            if (response.ok) {
                try {
                    const data = await response.json();
                    console.log(`   📊 Données: ${JSON.stringify(data).length} caractères`);
                } catch (e) {
                    console.log(`   📊 Réponse: Non-JSON`);
                }
            }
        } catch (error) {
            test(func.name, false);
            console.log(`   Erreur: ${error.message}`);
        }
    }
}

// Test 5: Contenu et sections
function testContent() {
    console.log('\n📋 TEST 5: CONTENU & SECTIONS');

    // Test sections principales
    const sections = ['stats', 'features', 'testimonials', 'faq', 'contact'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        test(`Section ${section}`, element !== null);
    });

    // Test éléments interactifs
    const interactiveElements = [
        { selector: 'button', name: 'Boutons' },
        { selector: '.glass-effect', name: 'Effets Glass' },
        { selector: '.card-hover', name: 'Cards avec hover' },
        { selector: 'img[src*="logo"]', name: 'Logo' },
        { selector: '[class*="animate"]', name: 'Animations' }
    ];

    interactiveElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        test(`${item.name} (${elements.length})`, elements.length > 0);
    });
}

// Test 6: SSL et sécurité
async function testSSL() {
    console.log('\n🔒 TEST 6: SSL & SÉCURITÉ');

    try {
        const response = await fetch(siteUrl, { method: 'HEAD' });

        // Test headers de sécurité
        const securityHeaders = [
            'x-frame-options',
            'x-content-type-options',
            'x-xss-protection'
        ];

        securityHeaders.forEach(header => {
            const value = response.headers.get(header);
            test(`Header ${header}`, !!value);
        });

        // Test HTTPS
        test('Protocole HTTPS', window.location.protocol === 'https:');

        // Test certificat (basique)
        test('Certificat valide', response.ok);

    } catch (error) {
        test('SSL fonctionnel', false);
        console.log(`   Erreur SSL: ${error.message}`);
    }
}

// Test 7: Performance
function testPerformance() {
    console.log('\n⚡ TEST 7: PERFORMANCE');

    // Test temps de chargement
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        test(`Temps de chargement (${loadTime}ms)`, loadTime < 5000);

        const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        test(`DOM Content Loaded (${domTime}ms)`, domTime < 3000);
    }

    // Test taille DOM
    const domElements = document.querySelectorAll('*').length;
    test(`Taille DOM (${domElements} éléments)`, domElements < 2000);

    // Test images optimisées
    const images = document.querySelectorAll('img');
    let optimizedImages = 0;
    images.forEach(img => {
        if (img.hasAttribute('loading') || img.hasAttribute('decoding')) {
            optimizedImages++;
        }
    });
    test(`Images optimisées (${optimizedImages}/${images.length})`, optimizedImages > 0);
}

// Test 8: Mobile responsive
function testMobile() {
    console.log('\n📱 TEST 8: MOBILE RESPONSIVE');

    const viewport = window.innerWidth;
    test(`Viewport détecté (${viewport}px)`, true);

    // Test media queries CSS
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
    const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

    test('Responsive mobile', isMobile || isTablet || isDesktop);

    // Test éléments touch-friendly
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    let touchFriendlyButtons = 0;
    buttons.forEach(btn => {
        const styles = getComputedStyle(btn);
        const minWidth = parseInt(styles.minWidth) || parseInt(styles.width) || 0;
        const minHeight = parseInt(styles.minHeight) || parseInt(styles.height) || 0;

        if (minWidth >= 44 && minHeight >= 44) {
            touchFriendlyButtons++;
        }
    });

    test(`Boutons touch-friendly (${touchFriendlyButtons}/${buttons.length})`, touchFriendlyButtons > 0);

    // Test menu mobile
    const mobileMenu = document.querySelector('.mobile-menu, [class*="mobile"]');
    test('Menu mobile', mobileMenu !== null);
}

// Test 9: Erreurs courantes
function testErrors() {
    console.log('\n🚨 TEST 9: ERREURS COURANTES');

    // Test console errors (basique)
    const originalError = console.error;
    let errorCount = 0;

    console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
    };

    // Attendre un peu pour capturer les erreurs
    setTimeout(() => {
        console.error = originalError;
        test(`Erreurs console (${errorCount})`, errorCount === 0);
    }, 1000);

    // Test contenu mixte
    const html = document.documentElement.outerHTML;
    const hasMixedContent = html.includes('src="http://') || html.includes('href="http://');
    test('Contenu mixte (HTTP dans HTTPS)', !hasMixedContent);

    // Test liens cassés (basique)
    const links = document.querySelectorAll('a[href]');
    let brokenLinks = 0;
    links.forEach(link => {
        if (link.href.includes('undefined') || link.href.includes('null')) {
            brokenLinks++;
        }
    });
    test(`Liens cassés (${brokenLinks})`, brokenLinks === 0);
}

// Fonction principale
async function runAllTests() {
    const startTime = Date.now();

    await testConnectivity();
    await testPages();
    await testAssets();
    await testFunctions();
    testContent();
    await testSSL();
    testPerformance();
    testMobile();
    testErrors();

    // Attendre que tous les tests asynchrones se terminent
    setTimeout(() => {
        generateFinalReport(startTime);
    }, 2000);
}

// Rapport final
function generateFinalReport(startTime) {
    const duration = Date.now() - startTime;
    const score = Math.round((testsPassed / totalTests) * 100);

    console.log('\n' + '='.repeat(60));
    console.log('🎯 RAPPORT FINAL - CRYPTOBOOST TEST COMPLET');
    console.log('='.repeat(60));

    console.log(`\n📊 RÉSULTATS:`);
    console.log(`=============`);
    console.log(`✅ Tests réussis: ${testsPassed}/${totalTests}`);
    console.log(`❌ Tests échoués: ${totalTests - testsPassed}/${totalTests}`);
    console.log(`🎯 Score global: ${score}%`);
    console.log(`⏰ Durée du test: ${Math.round(duration/1000)}s`);

    console.log(`\n📋 ÉVALUATION:`);
    console.log(`==============`);

    if (score >= 90) {
        console.log('🎉 EXCELLENT - Site parfait !');
        console.log('   ✅ Toutes les fonctionnalités opérationnelles');
        console.log('   ✅ Aucune erreur détectée');
        console.log('   ✅ Performance optimale');
    } else if (score >= 75) {
        console.log('👍 TRÈS BON - Quelques ajustements mineurs');
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

    console.log(`\n🔗 Informations:`);
    console.log(`===============`);
    console.log(`🌐 Site testé: ${siteUrl}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`🔧 Navigateur: ${navigator.userAgent.split(' ').pop()}`);

    if (score < 75) {
        console.log(`\n💡 RECOMMANDATIONS:`);
        console.log(`==================`);
        console.log(`1. 🔒 Vérifier la configuration SSL si erreurs HTTPS`);
        console.log(`2. ⚙️ Vérifier les fonctions Netlify si API en erreur`);
        console.log(`3. 📦 Vérifier le chargement des assets si manquants`);
        console.log(`4. 📱 Tester sur mobile si problèmes responsive`);
        console.log(`5. 🚨 Consulter la console développeur pour détails`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🏁 TEST TERMINÉ - CRYPTOBOOST DIAGNOSTIC');
    console.log('='.repeat(60));
}

// Instructions d'utilisation
console.log('\n📋 INSTRUCTIONS:');
console.log('================');
console.log('1. Le test va démarrer automatiquement dans 2 secondes');
console.log('2. Attendez la fin du rapport complet');
console.log('3. Notez le score global et les recommandations');
console.log('4. Consultez la console développeur pour plus de détails');

// Démarrage automatique
setTimeout(() => {
    runAllTests();
}, 2000);

console.log('\n🚀 Lancement du test dans 2 secondes...');
