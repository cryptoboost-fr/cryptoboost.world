// Test final avant push
const fs = require('fs');
const path = require('path');

console.log('🚀 TEST FINAL CRYPTOBOOST');
console.log('=====================');
console.log(`⏰ ${new Date().toLocaleString()}\n`);

const results = {
    success: 0,
    failures: 0,
    total: 0
};

// Test des fichiers principaux
const mainFiles = [
    'app.js',
    'crypto-api.js',
    'auth.js',
    'styles.css',
    'index.html',
    'plans.html',
    'blog.html',
    'faq.html'
];

console.log('📁 Vérification des fichiers principaux...\n');

mainFiles.forEach(file => {
    results.total++;
    try {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        if (content && content.length > 0) {
            console.log(`✅ ${file} : OK`);
            results.success++;
        } else {
            console.log(`❌ ${file} : Vide`);
            results.failures++;
        }
    } catch (error) {
        console.log(`❌ ${file} : ${error.message}`);
        results.failures++;
    }
});

// Test du code JavaScript
console.log('\n⚙️ Vérification du code JavaScript...\n');

try {
    const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
    
    const requiredFunctions = [
        'convertCrypto',
        'handleExchange',
        'updatePrices',
        'validateForm',
        'showNotification'
    ];

    requiredFunctions.forEach(func => {
        results.total++;
        if (appJs.includes(func)) {
            console.log(`✅ Fonction ${func} : Présente`);
            results.success++;
        } else {
            console.log(`❌ Fonction ${func} : Manquante`);
            results.failures++;
        }
    });
} catch (error) {
    console.log('❌ Erreur lors de la vérification de app.js:', error);
    results.failures++;
}

// Test des pages HTML
console.log('\n🌐 Vérification des pages HTML...\n');

const htmlFiles = [
    'index.html',
    'plans.html',
    'blog.html',
    'faq.html'
];

htmlFiles.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        
        // Vérification des éléments requis
        const checks = [
            { name: 'DOCTYPE', test: content.includes('<!DOCTYPE html>') },
            { name: 'Viewport Meta', test: content.includes('viewport') },
            { name: 'app.js', test: content.includes('app.js') },
            { name: 'styles.css', test: content.includes('styles.css') }
        ];

        console.log(`\n📄 ${file}:`);
        checks.forEach(check => {
            results.total++;
            if (check.test) {
                console.log(`✅ ${check.name} : OK`);
                results.success++;
            } else {
                console.log(`❌ ${check.name} : Manquant`);
                results.failures++;
            }
        });
    } catch (error) {
        console.log(`❌ Erreur lors de la vérification de ${file}:`, error);
        results.failures++;
    }
});

// Test des intégrations
console.log('\n🔗 Vérification des intégrations...\n');

const integrations = [
    { file: 'crypto-api.js', function: 'getRates' },
    { file: 'app.js', function: 'handleTransaction' },
    { file: 'app.js', function: 'updateWalletDisplays' }
];

integrations.forEach(integration => {
    results.total++;
    try {
        const content = fs.readFileSync(path.join(__dirname, integration.file), 'utf8');
        if (content.includes(integration.function)) {
            console.log(`✅ ${integration.file} - ${integration.function} : OK`);
            results.success++;
        } else {
            console.log(`❌ ${integration.file} - ${integration.function} : Non trouvé`);
            results.failures++;
        }
    } catch (error) {
        console.log(`❌ Erreur lors de la vérification de ${integration.file}:`, error);
        results.failures++;
    }
});

// Affichage des résultats
console.log('\n📊 RÉSULTATS DES TESTS');
console.log('===================');
console.log(`✅ Succès: ${results.success}`);
console.log(`❌ Échecs: ${results.failures}`);
console.log(`📈 Score: ${Math.round((results.success / results.total) * 100)}%`);

// Recommandation finale
const score = (results.success / results.total) * 100;
if (score >= 90) {
    console.log('\n✨ Le site est prêt pour le push !');
} else if (score >= 75) {
    console.log('\n⚠️ Quelques corrections mineures recommandées avant le push.');
} else {
    console.log('\n❌ Des corrections importantes sont nécessaires avant le push.');
}
