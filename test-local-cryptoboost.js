// 🚀 TEST LOCAL CRYPTOBOOST - LANCEMENT IMMÉDIAT
// Script à exécuter pour tester localement CryptoBoost

const fs = require('fs');
const path = require('path');

console.log('🚀 TEST LOCAL CRYPTOBOOST - LANCEMENT IMMÉDIAT');
console.log('=============================================');
console.log(`⏰ ${new Date().toLocaleString()}`);
console.log(`📁 Dossier: ${process.cwd()}`);

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

// Test 1: Structure du projet
console.log('\n📁 TEST 1: STRUCTURE DU PROJET');
console.log('==============================');

// Vérifier les fichiers critiques
const criticalFiles = [
    { name: 'index.html', path: 'index.html', critical: true },
    { name: 'styles.css', path: 'styles.css', critical: true },
    { name: 'app.js', path: 'app.js', critical: true },
    { name: 'auth.js', path: 'auth.js', critical: true },
    { name: 'admin.js', path: 'admin.js', critical: true },
    { name: 'netlify.toml', path: 'netlify.toml', critical: true }
];

criticalFiles.forEach(file => {
    const exists = fs.existsSync(file.path);
    test(`Fichier ${file.name}`, exists, file.critical ? 'high' : 'medium');
});

// Test 2: Pages HTML
console.log('\n📄 TEST 2: PAGES HTML');
console.log('===================');

const htmlPages = [
    { name: 'Accueil', path: 'index.html' },
    { name: 'À propos', path: 'about.html' },
    { name: 'Contact', path: 'contact.html' },
    { name: 'CGU', path: 'cgu.html' },
    { name: 'Cookies', path: 'cookies.html' },
    { name: 'Politique de confidentialité', path: 'privacy.html' },
    { name: 'Dashboard Client', path: 'client-dashboard.html' },
    { name: 'Investissements Client', path: 'client-investments.html' },
    { name: 'Transactions Client', path: 'client-transactions.html' },
    { name: 'Wallets Client', path: 'client-wallets.html' },
    { name: 'Notifications Client', path: 'client-notifications.html' },
    { name: 'Profil Client', path: 'client-profile.html' },
    { name: 'Support Client', path: 'client-support.html' },
    { name: 'Dashboard Admin', path: 'admin.html' },
    { name: 'Utilisateurs Admin', path: 'admin-users.html' },
    { name: 'Transactions Admin', path: 'admin-transactions.html' },
    { name: 'Investissements Admin', path: 'admin-investments.html' },
    { name: 'Wallets Admin', path: 'admin-wallets.html' },
    { name: 'Rapports Admin', path: 'admin-reports.html' },
    { name: 'Paramètres Admin', path: 'admin-settings.html' }
];

htmlPages.forEach(page => {
    const exists = fs.existsSync(page.path);
    test(`Page ${page.name}`, exists, page.path.includes('admin') || page.path.includes('client') ? 'medium' : 'high');
});

// Test 3: Fonctions Netlify
console.log('\n🔗 TEST 3: FONCTIONS NETLIFY');
console.log('===========================');

const netlifyFunctions = [
    { name: 'GitHub DB', path: 'functions/github-db.js' },
    { name: 'CoinAPI', path: 'functions/coinapi.js' },
    { name: 'GitHub DB Enhanced', path: 'functions/github-db-enhanced.js' },
    { name: 'CoinAPI Enhanced', path: 'functions/coinapi-enhanced.js' }
];

netlifyFunctions.forEach(func => {
    const exists = fs.existsSync(func.path);
    test(`Fonction ${func.name}`, exists, 'high');
});

// Test 4: Assets
console.log('\n🖼️ TEST 4: ASSETS ET RESSOURCES');
console.log('==============================');

const assets = [
    { name: 'Logo SVG', path: 'assets/logo.svg' },
    { name: 'Hero Chart', path: 'assets/hero-chart.svg' },
    { name: 'Favicon', path: 'assets/favicon.svg' },
    { name: 'Animations CSS', path: 'assets/enhanced-animations.css' },
    { name: 'Interactions JS', path: 'assets/enhanced-interactions.js' }
];

assets.forEach(asset => {
    const exists = fs.existsSync(asset.path);
    test(`${asset.name}`, exists, asset.path.includes('logo') ? 'high' : 'medium');
});

// Test 5: Scripts de test
console.log('\n🧪 TEST 5: SCRIPTS DE TEST');
console.log('=========================');

const testScripts = [
    { name: 'Test Complet', path: 'test-complet-cryptoboost.js' },
    { name: 'Diagnostic Console', path: 'diagnostic-console.js' },
    { name: 'Diagnostic Rapide', path: 'diagnostic-rapide.js' },
    { name: 'Vérification Erreurs', path: 'final-error-check.js' },
    { name: 'Test Site Live', path: 'live-site-quick-test.js' }
];

testScripts.forEach(script => {
    const exists = fs.existsSync(script.path);
    test(`${script.name}`, exists, 'medium');
});

// Test 6: Scripts de correction
console.log('\n🔧 TEST 6: SCRIPTS DE CORRECTION');
console.log('===============================');

const fixScripts = [
    { name: 'Correction Assets', path: 'fix-assets-loading.js' },
    { name: 'Correction JS Errors', path: 'fix-js-errors.js' },
    { name: 'Correction 404', path: 'fix-404-pages.js' },
    { name: 'Corrections Complètes', path: 'final-bug-fixes-complete.js' },
    { name: 'Guide Corrections', path: 'bug-fixes-guide-complete.md' }
];

fixScripts.forEach(script => {
    const exists = fs.existsSync(script.path);
    test(`${script.name}`, exists, 'medium');
});

// Test 7: Configuration
console.log('\n⚙️ TEST 7: CONFIGURATION');
console.log('========================');

const configFiles = [
    { name: '.gitignore', path: '.gitignore' },
    { name: '.env.example', path: '.env.example' },
    { name: 'crypto-api.js', path: 'crypto-api.js' }
];

configFiles.forEach(config => {
    const exists = fs.existsSync(config.path);
    test(`${config.name}`, exists, config.path.includes('gitignore') || config.path.includes('env') ? 'medium' : 'high');
});

// Test 8: Analyse du contenu des fichiers critiques
console.log('\n📋 TEST 8: ANALYSE DU CONTENU');
console.log('==============================');

// Analyser index.html
if (fs.existsSync('index.html')) {
    const indexContent = fs.readFileSync('index.html', 'utf8');

    test('Titre CryptoBoost dans HTML', indexContent.includes('CryptoBoost'), 'high');
    test('Meta viewport mobile', indexContent.includes('viewport') && indexContent.includes('width=device-width'), 'high');
    test('Feuille de style CSS', indexContent.includes('styles.css'), 'high');
    test('Script app.js', indexContent.includes('app.js'), 'high');
    test('Script auth.js', indexContent.includes('auth.js'), 'high');
    test('Modal de connexion', indexContent.includes('loginModal'), 'high');
    test('Modal d\'inscription', indexContent.includes('registerModal'), 'high');
    test('Section hero', indexContent.includes('hero'), 'medium');
    test('Section stats', indexContent.includes('stats'), 'medium');
    test('Section features', indexContent.includes('features'), 'medium');
}

// Analyser styles.css
if (fs.existsSync('styles.css')) {
    const cssContent = fs.readFileSync('styles.css', 'utf8');

    test('Variables CSS crypto', cssContent.includes('--crypto-primary'), 'medium');
    test('Variables CSS gradients', cssContent.includes('--gradient-crypto'), 'medium');
    test('Animations CSS', cssContent.includes('@keyframes') || cssContent.includes('animation'), 'medium');
    test('Media queries responsive', cssContent.includes('@media'), 'medium');
    test('Styles Tailwind', cssContent.includes('bg-') || cssContent.includes('text-') || cssContent.includes('p-'), 'medium');
}

// Analyser app.js
if (fs.existsSync('app.js')) {
    const appContent = fs.readFileSync('app.js', 'utf8');

    const criticalFunctions = ['showLogin', 'showRegister', 'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange'];
    criticalFunctions.forEach(func => {
        test(`Fonction ${func} dans app.js`, appContent.includes(`function ${func}`) || appContent.includes(`${func} =`), 'high');
    });
}

// Analyser auth.js
if (fs.existsSync('auth.js')) {
    const authContent = fs.readFileSync('auth.js', 'utf8');

    const authFunctions = ['validateAuth', 'getCurrentUser', 'protectPage', 'logout'];
    authFunctions.forEach(func => {
        test(`Fonction ${func} dans auth.js`, authContent.includes(`function ${func}`) || authContent.includes(`${func} =`), 'high');
    });
}

// Test 9: Taille des fichiers
console.log('\n📏 TEST 9: TAILLE DES FICHIERS');
console.log('==============================');

const fileSizeChecks = [
    { name: 'index.html', path: 'index.html', maxSize: 100000 }, // 100KB
    { name: 'styles.css', path: 'styles.css', maxSize: 500000 }, // 500KB
    { name: 'app.js', path: 'app.js', maxSize: 200000 }, // 200KB
    { name: 'admin.js', path: 'admin.js', maxSize: 150000 }, // 150KB
];

fileSizeChecks.forEach(check => {
    if (fs.existsSync(check.path)) {
        const stats = fs.statSync(check.path);
        const sizeKB = Math.round(stats.size / 1024);
        test(`Taille ${check.name} (${sizeKB}KB)`, stats.size <= check.maxSize, stats.size > check.maxSize * 1.5 ? 'high' : 'medium');
    }
});

// Test 10: Scripts de test disponibles
console.log('\n🧪 TEST 10: SCRIPTS DE TEST DISPONIBLES');
console.log('=====================================');

const availableTests = [
    'test-complet-cryptoboost.js',
    'diagnostic-console.js',
    'final-error-check.js',
    'live-site-quick-test.js',
    'test-session-functionality.js',
    'quick-function-test.js'
];

availableTests.forEach(testFile => {
    const exists = fs.existsSync(testFile);
    test(`Script de test: ${testFile}`, exists, 'medium');
});

// Rapport final
const score = Math.round((success / tests) * 100);

console.log('\n' + '='.repeat(80));
console.log('🎯 RAPPORT FINAL TEST LOCAL CRYPTOBOOST');
console.log('='.repeat(80));

console.log(`\n📊 RÉSULTATS GÉNÉRAUX:`);
console.log(`======================`);
console.log(`✅ Tests réussis: ${success}/${tests}`);
console.log(`❌ Erreurs critiques: ${errors}`);
console.log(`⚠️ Avertissements: ${warnings}`);
console.log(`🎯 Score global: ${score}%`);

console.log(`\n📋 ÉVALUATION:`);
console.log(`==============`);

if (score >= 90) {
    console.log('🎉 EXCELLENT - Projet complet et fonctionnel !');
    console.log('   ✅ Tous les fichiers critiques présents');
    console.log('   ✅ Structure de projet optimale');
    console.log('   ✅ Scripts de test et correction disponibles');
} else if (score >= 80) {
    console.log('👍 TRÈS BON - Quelques fichiers manquants');
    console.log('   ⚠️ Vérifier les fichiers manquants');
    console.log('   ✅ Base solide présente');
} else if (score >= 70) {
    console.log('🟡 BON - Corrections recommandées');
    console.log('   ❌ Fichiers critiques manquants');
    console.log('   ✅ Structure de base présente');
} else if (score >= 50) {
    console.log('🟠 MOYEN - Fichiers manquants');
    console.log('   ❌ Plusieurs fichiers critiques absents');
    console.log('   ⚠️ Reconstruction partielle nécessaire');
} else {
    console.log('❌ CRITIQUE - Projet incomplet');
    console.log('   🚨 Fichiers essentiels manquants');
    console.log('   ❌ Reconstruction majeure nécessaire');
}

console.log(`\n🔧 RECOMMANDATIONS:`);
console.log(`==================`);

if (errors > 0) {
    console.log('🚨 Créer les fichiers critiques manquants');
}
if (warnings > 5) {
    console.log('⚠️ Vérifier l\'intégrité des fichiers existants');
}
if (score < 80) {
    console.log('🔧 Utiliser les scripts de correction automatique');
}

console.log(`\n📁 FICHIERS CRITIQUES MANQUANTS:`);
console.log(`==============================`);

// Lister les fichiers manquants
const allFiles = [
    ...criticalFiles,
    ...htmlPages.map(p => ({ name: p.name, path: p.path })),
    ...netlifyFunctions,
    ...assets,
    ...configFiles
];

const missingFiles = allFiles.filter(file => !fs.existsSync(file.path));
if (missingFiles.length > 0) {
    missingFiles.forEach(file => {
        console.log(`   • ${file.name} (${file.path})`);
    });
} else {
    console.log('   ✅ Aucun fichier manquant !');
}

console.log(`\n📅 RÉSUMÉ:`);
console.log(`==========`);
console.log(`📁 Dossier analysé: ${process.cwd()}`);
console.log(`📅 Date: ${new Date().toLocaleString()}`);
console.log(`📊 Total fichiers: ${tests}`);
console.log(`✅ Fichiers valides: ${success}`);

console.log('\n' + '='.repeat(80));
console.log('🏁 TEST LOCAL TERMINÉ');
console.log('='.repeat(80));

if (score < 100) {
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('===================');
    console.log('1. 📁 Créer les fichiers manquants');
    console.log('2. 🔍 Vérifier l\'intégrité des fichiers existants');
    console.log('3. 🧪 Lancer les tests sur le site live');
    console.log('4. 🔧 Appliquer les corrections automatiques');
    console.log('5. 🚀 Pousser les corrections sur GitHub');
}

console.log('\n🎯 Pour tester sur le site live:');
console.log('   🌐 https://cryptoboost.world');
console.log('   📋 Utilisez test-complet-cryptoboost.js dans la console');
