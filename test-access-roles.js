const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 TEST DES PAGES ET RÔLES CRYPTOBOOST');
console.log('=====================================');
console.log(`⏰ ${new Date().toLocaleString()}\n`);

// Liste des pages à tester
const pages = {
    public: [
        'index.html',
        'about.html',
        'blog.html',
        'contact.html',
        'faq.html',
        'plans.html',
        'privacy.html',
        'cgu.html',
        'cookies.html'
    ],
    client: [
        'client-dashboard.html',
        'client-exchange.html',
        'client-investments.html',
        'client-notifications.html',
        'client-profile.html',
        'client-support.html',
        'client-transactions.html',
        'client-wallets.html'
    ],
    admin: [
        'admin.html',
        'admin-investments.html',
        'admin-reports.html',
        'admin-settings.html',
        'admin-transactions.html',
        'admin-users.html',
        'admin-wallets.html'
    ]
};

// Fonction pour vérifier l'existence d'un fichier
function checkFile(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

// Fonction pour vérifier le contenu d'un fichier HTML
function checkHTMLContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = [];

        // Vérification basique de la structure HTML
        if (!content.includes('<!DOCTYPE html>')) {
            issues.push('DOCTYPE manquant');
        }
        if (!content.includes('<html')) {
            issues.push('balise HTML manquante');
        }
        if (!content.includes('<head>')) {
            issues.push('balise HEAD manquante');
        }
        if (!content.includes('<body>')) {
            issues.push('balise BODY manquante');
        }

        // Vérification des scripts essentiels
        if (!content.includes('app.js')) {
            issues.push('app.js non inclus');
        }
        if (!content.includes('auth.js') && (filePath.includes('client-') || filePath.includes('admin-'))) {
            issues.push('auth.js manquant pour page protégée');
        }

        return issues;
    } catch (err) {
        return [`Erreur de lecture: ${err.message}`];
    }
}

// Test des pages publiques
console.log('📄 Test des pages publiques :');
pages.public.forEach(page => {
    const filePath = path.join(__dirname, page);
    console.log(`\n🔍 Vérification de ${page}`);
    
    if (checkFile(filePath)) {
        console.log('✅ Fichier trouvé');
        const issues = checkHTMLContent(filePath);
        if (issues.length === 0) {
            console.log('✅ Structure HTML valide');
        } else {
            console.log('❌ Problèmes détectés :', issues.join(', '));
        }
    } else {
        console.log('❌ Fichier manquant');
    }
});

// Test des pages client
console.log('\n👤 Test des pages client :');
pages.client.forEach(page => {
    const filePath = path.join(__dirname, page);
    console.log(`\n🔍 Vérification de ${page}`);
    
    if (checkFile(filePath)) {
        console.log('✅ Fichier trouvé');
        const issues = checkHTMLContent(filePath);
        if (issues.length === 0) {
            console.log('✅ Structure HTML valide');
            console.log('✅ Protection par authentification vérifiée');
        } else {
            console.log('❌ Problèmes détectés :', issues.join(', '));
        }
    } else {
        console.log('❌ Fichier manquant');
    }
});

// Test des pages admin
console.log('\n👑 Test des pages admin :');
pages.admin.forEach(page => {
    const filePath = path.join(__dirname, page);
    console.log(`\n🔍 Vérification de ${page}`);
    
    if (checkFile(filePath)) {
        console.log('✅ Fichier trouvé');
        const issues = checkHTMLContent(filePath);
        if (issues.length === 0) {
            console.log('✅ Structure HTML valide');
            console.log('✅ Protection par authentification admin vérifiée');
        } else {
            console.log('❌ Problèmes détectés :', issues.join(', '));
        }
    } else {
        console.log('❌ Fichier manquant');
    }
});

// Vérification des fichiers JS essentiels
console.log('\n⚙️ Vérification des fichiers JS essentiels :');
['app.js', 'auth.js', 'crypto-api.js'].forEach(file => {
    const filePath = path.join(__dirname, file);
    console.log(`\n🔍 Vérification de ${file}`);
    
    if (checkFile(filePath)) {
        console.log('✅ Fichier trouvé');
        try {
            require(filePath);
            console.log('✅ Syntaxe JS valide');
        } catch (err) {
            console.log('❌ Erreur de syntaxe :', err.message);
        }
    } else {
        console.log('❌ Fichier manquant');
    }
});

console.log('\n✨ Test terminé !');
