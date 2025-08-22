const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION AUTOMATIQUE DES PROBLÈMES');
console.log('=====================================');
console.log(`⏰ ${new Date().toLocaleString()}\n`);

// Template HTML de base
const baseTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoBoost</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    {{CUSTOM_HEAD}}
</head>
<body>
    {{CONTENT}}
    <script src="app.js"></script>
    {{CUSTOM_SCRIPTS}}
</body>
</html>`;

// Fonction pour corriger un fichier HTML
function fixHTMLFile(filePath, isProtected = false) {
    console.log(`🔧 Correction de ${filePath}`);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Extraire le contenu entre <body> et </body> s'il existe
        let bodyContent = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (!bodyContent) {
            // Si pas de balises body, prendre tout le contenu comme corps
            bodyContent = content;
        } else {
            bodyContent = bodyContent[1];
        }

        // Extraire les scripts personnalisés
        const scripts = [];
        content.replace(/<script[^>]*src=["']([^"']+)["'][^>]*>/g, (match, src) => {
            if (src !== 'app.js') {
                scripts.push(src);
            }
        });

        // Construire les balises de script
        let customScripts = scripts.map(src => `    <script src="${src}"></script>`).join('\n');
        
        // Ajouter auth.js pour les pages protégées
        if (isProtected) {
            customScripts += '\n    <script src="auth.js"></script>';
        }

        // Créer le nouveau contenu
        let newContent = baseTemplate
            .replace('{{CONTENT}}', bodyContent)
            .replace('{{CUSTOM_SCRIPTS}}', customScripts)
            .replace('{{CUSTOM_HEAD}}', '');

        // Sauvegarder le fichier
        fs.writeFileSync(filePath, newContent);
        console.log('✅ Fichier corrigé\n');
    } catch (err) {
        console.log(`❌ Erreur lors de la correction : ${err.message}\n`);
    }
}

// Liste des fichiers à corriger
const files = {
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
    protected: [
        'client-dashboard.html',
        'client-exchange.html',
        'client-investments.html',
        'client-notifications.html',
        'client-profile.html',
        'client-support.html',
        'client-transactions.html',
        'client-wallets.html',
        'admin.html',
        'admin-investments.html',
        'admin-reports.html',
        'admin-settings.html',
        'admin-transactions.html',
        'admin-users.html',
        'admin-wallets.html'
    ]
};

// Corriger les fichiers publics
console.log('📄 Correction des pages publiques...');
files.public.forEach(file => {
    fixHTMLFile(path.join(__dirname, file), false);
});

// Corriger les fichiers protégés
console.log('🔒 Correction des pages protégées...');
files.protected.forEach(file => {
    fixHTMLFile(path.join(__dirname, file), true);
});

console.log('✨ Corrections terminées !');
