// 🔧 CORRECTION DES PAGES 404 ET PROBLÈMES DE ROUTAGE
// Script pour diagnostiquer et corriger les erreurs 404

class Page404Fixer {
    constructor() {
        this.issues = [];
        this.fixes = [];
        this.siteUrl = window.location.origin;
    }

    async diagnoseAndFix() {
        console.log('🔍 DIAGNOSTIC PAGES 404 ET ROUTAGE');
        console.log('==================================');

        await this.checkCurrentPage();
        await this.checkAllRoutes();
        await this.checkBrokenLinks();
        await this.checkRedirects();
        await this.generateReport();

        if (this.issues.length > 0) {
            await this.applyFixes();
        }
    }

    // Vérifier la page actuelle
    async checkCurrentPage() {
        console.log('\n📄 VÉRIFICATION PAGE ACTUELLE');

        const currentPath = window.location.pathname;
        const response = await fetch(currentPath, { method: 'HEAD' });

        console.log(`🌐 URL actuelle: ${window.location.href}`);
        console.log(`📂 Chemin: ${currentPath}`);
        console.log(`📊 Status: ${response.status} ${response.statusText}`);

        if (response.status === 404) {
            this.issues.push({
                type: 'current_page_404',
                path: currentPath,
                url: window.location.href,
                severity: 'high'
            });
            console.log('❌ Page 404 détectée !');
        } else {
            console.log('✅ Page accessible');
        }

        // Vérifier si c'est une SPA (Single Page Application)
        const isSPA = document.querySelector('[data-router], #router, .router-view') !== null;
        if (isSPA) {
            console.log('🔄 Application SPA détectée');
            this.checkSPA();
        }
    }

    // Vérifier les routes principales
    async checkAllRoutes() {
        console.log('\n🛣️ VÉRIFICATION ROUTES PRINCIPALES');

        const routes = [
            { name: 'Accueil', path: '/' },
            { name: 'Admin', path: '/admin.html' },
            { name: 'Client Dashboard', path: '/client-dashboard.html' },
            { name: 'About', path: '/about.html' },
            { name: 'Contact', path: '/contact.html' },
            { name: 'Privacy', path: '/privacy.html' },
            { name: 'Terms', path: '/terms.html' },
            { name: 'Login', path: '/login.html' },
            { name: 'Register', path: '/register.html' }
        ];

        for (const route of routes) {
            try {
                const response = await fetch(`${this.siteUrl}${route.path}`, { method: 'HEAD' });
                const status = response.ok ? '✅' : '❌';

                console.log(`${status} ${route.name}: ${response.status} ${response.statusText}`);

                if (!response.ok) {
                    this.issues.push({
                        type: 'route_404',
                        route: route,
                        status: response.status,
                        severity: response.status === 404 ? 'high' : 'medium'
                    });
                }

            } catch (error) {
                console.log(`❌ ${route.name}: Erreur réseau`);
                this.issues.push({
                    type: 'route_network_error',
                    route: route,
                    error: error.message,
                    severity: 'high'
                });
            }
        }
    }

    // Vérifier les liens cassés
    async checkBrokenLinks() {
        console.log('\n🔗 VÉRIFICATION LIENS CASSÉS');

        const links = document.querySelectorAll('a[href]');
        console.log(`📊 ${links.length} liens trouvés`);

        const brokenLinks = [];

        for (const link of links) {
            const href = link.href;

            // Ignorer les liens externes et les ancres
            if (href.startsWith('http') && !href.includes(this.siteUrl)) {
                continue; // Lien externe
            }

            if (href.startsWith('#')) {
                continue; // Ancre
            }

            if (href.includes('mailto:') || href.includes('tel:')) {
                continue; // Email ou téléphone
            }

            try {
                const response = await fetch(href, { method: 'HEAD' });
                if (!response.ok) {
                    brokenLinks.push({
                        href: href,
                        text: link.textContent.trim(),
                        status: response.status
                    });
                }
            } catch (error) {
                brokenLinks.push({
                    href: href,
                    text: link.textContent.trim(),
                    error: error.message
                });
            }
        }

        if (brokenLinks.length > 0) {
            console.log(`❌ ${brokenLinks.length} liens cassés trouvés:`);
            brokenLinks.forEach(link => {
                console.log(`   - ${link.href} ("${link.text}")`);
                this.issues.push({
                    type: 'broken_link',
                    link: link,
                    severity: 'medium'
                });
            });
        } else {
            console.log('✅ Aucun lien cassé détecté');
        }
    }

    // Vérifier les redirections
    async checkRedirects() {
        console.log('\n🔄 VÉRIFICATION REDIRECTIONS');

        const redirectTests = [
            { from: '/home', to: '/' },
            { from: '/dashboard', to: '/client-dashboard.html' },
            { from: '/login', to: '/#login' },
            { from: '/register', to: '/#register' }
        ];

        for (const test of redirectTests) {
            try {
                const response = await fetch(`${this.siteUrl}${test.from}`, { method: 'HEAD' });
                if (response.status === 404) {
                    console.log(`❌ Redirection manquante: ${test.from} → ${test.to}`);
                    this.issues.push({
                        type: 'missing_redirect',
                        redirect: test,
                        severity: 'low'
                    });
                } else {
                    console.log(`✅ Route accessible: ${test.from}`);
                }
            } catch (error) {
                console.log(`❌ Erreur vérification: ${test.from}`);
            }
        }
    }

    // Vérifier si c'est une SPA
    checkSPA() {
        console.log('\n🔄 ANALYSE SPA (Single Page Application)');

        // Vérifier les routes JavaScript
        const hasHashRoutes = document.querySelector('a[href^="#"]') !== null;
        const hasHistoryAPI = typeof history.pushState === 'function';

        console.log(`📊 Routes hash (#): ${hasHashRoutes ? 'Oui' : 'Non'}`);
        console.log(`📊 History API: ${hasHistoryAPI ? 'Oui' : 'Non'}`);

        if (hasHashRoutes || hasHistoryAPI) {
            console.log('🔄 Application SPA confirmée');
            this.setupSPAFallback();
        }
    }

    // Configuration SPA fallback
    setupSPAFallback() {
        console.log('\n🔧 CONFIGURATION SPA FALLBACK');

        // Intercepter les clics sur les liens internes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href.startsWith(this.siteUrl)) {
                e.preventDefault();
                const path = link.href.replace(this.siteUrl, '');

                // Simuler navigation SPA
                this.handleSPARoute(path);
            }
        });

        // Gérer les changements d'URL (back/forward)
        window.addEventListener('popstate', (e) => {
            const path = window.location.pathname;
            this.handleSPARoute(path);
        });

        console.log('✅ SPA fallback configuré');
    }

    // Gestion des routes SPA
    handleSPARoute(path) {
        console.log(`🔄 Navigation SPA: ${path}`);

        // Masquer tous les contenus
        const contents = document.querySelectorAll('.page-content, .route-content, section');
        contents.forEach(content => content.style.display = 'none');

        // Afficher le contenu approprié
        const targetContent = document.querySelector(`[data-route="${path}"], #${path.substring(1)}`);

        if (targetContent) {
            targetContent.style.display = 'block';
            console.log(`✅ Contenu affiché: ${path}`);
        } else {
            // Page 404 SPA
            this.showSPA404(path);
        }

        // Mettre à jour l'URL
        history.pushState(null, null, path);
    }

    // Page 404 pour SPA
    showSPA404(path) {
        console.log(`❌ Route SPA non trouvée: ${path}`);

        const existing404 = document.getElementById('spa-404');
        if (existing404) {
            existing404.style.display = 'block';
            return;
        }

        const spa404 = document.createElement('div');
        spa404.id = 'spa-404';
        spa404.innerHTML = `
            <div style="
                padding: 40px;
                text-align: center;
                background: rgba(239, 68, 68, 0.1);
                border: 2px solid rgba(239, 68, 68, 0.3);
                border-radius: 16px;
                margin: 20px;
            ">
                <h2 style="color: #ef4444; margin-bottom: 16px;">Page non trouvée</h2>
                <p style="color: #e2e8f0; margin-bottom: 24px;">
                    La page <strong>${path}</strong> n'existe pas.
                </p>
                <button onclick="window.location.href='/'" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    Retour à l'accueil
                </button>
            </div>
        `;

        document.body.appendChild(spa404);
    }

    // Génération du rapport
    generateReport() {
        console.log('\n📋 RAPPORT PAGES 404 ET ROUTAGE');
        console.log('================================');

        const issueCount = this.issues.length;
        const severityCount = { high: 0, medium: 0, low: 0 };

        this.issues.forEach(issue => {
            severityCount[issue.severity]++;
        });

        console.log(`🚨 Problèmes détectés: ${issueCount}`);
        console.log(`🔴 Critiques: ${severityCount.high}`);
        console.log(`🟠 Moyens: ${severityCount.medium}`);
        console.log(`🟢 Mineurs: ${severityCount.low}`);

        if (this.issues.length > 0) {
            console.log('\n🚨 PROBLÈMES PAR CATÉGORIE:');

            const issuesByType = {};
            this.issues.forEach(issue => {
                if (!issuesByType[issue.type]) {
                    issuesByType[issue.type] = [];
                }
                issuesByType[issue.type].push(issue);
            });

            Object.entries(issuesByType).forEach(([type, issues]) => {
                console.log(`\n${type.toUpperCase()} (${issues.length}):`);
                issues.forEach(issue => {
                    const severity = issue.severity === 'high' ? '🔴' :
                                   issue.severity === 'medium' ? '🟠' : '🟢';

                    let description = '';
                    if (issue.path) description = issue.path;
                    else if (issue.route) description = issue.route.name;
                    else if (issue.link) description = issue.link.href;
                    else if (issue.redirect) description = `${issue.redirect.from} → ${issue.redirect.to}`;

                    console.log(`   ${severity} ${description}`);
                });
            });
        }
    }

    // Application des corrections
    async applyFixes() {
        console.log('\n🔧 APPLICATION DES CORRECTIONS');
        console.log('===============================');

        for (const issue of this.issues) {
            await this.fixIssue(issue);
        }

        console.log(`\n✅ ${this.fixes.length} corrections appliquées`);
    }

    async fixIssue(issue) {
        switch (issue.type) {
            case 'current_page_404':
                this.fixCurrentPage404(issue);
                break;

            case 'route_404':
                this.fixRoute404(issue);
                break;

            case 'broken_link':
                this.fixBrokenLink(issue);
                break;

            case 'missing_redirect':
                this.fixMissingRedirect(issue);
                break;

            case 'route_network_error':
                this.fixNetworkError(issue);
                break;
        }
    }

    // Correction page 404 actuelle
    fixCurrentPage404(issue) {
        console.log(`🔧 Correction page 404: ${issue.path}`);

        // Créer une page de fallback
        const fallbackPage = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CryptoBoost - Page non trouvée</title>
                <style>
                    body {
                        font-family: system-ui, -apple-system, sans-serif;
                        background: #0f172a;
                        color: #e2e8f0;
                        text-align: center;
                        padding: 50px;
                        margin: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #ef4444;
                        margin-bottom: 20px;
                    }
                    button {
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        margin: 10px;
                    }
                    button:hover {
                        background: #2563eb;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Page non trouvée (404)</h1>
                    <p>La page <strong>${issue.path}</strong> n'existe pas.</p>
                    <p>Elle a été automatiquement redirigée vers cette page de fallback.</p>
                    <button onclick="window.location.href='/'">Aller à l'accueil</button>
                    <button onclick="history.back()">Retour</button>
                </div>
            </body>
            </html>
        `;

        // Remplacer le contenu de la page
        document.open();
        document.write(fallbackPage);
        document.close();

        this.fixes.push(`Created 404 fallback page for: ${issue.path}`);
    }

    // Correction route 404
    fixRoute404(issue) {
        const route = issue.route;
        console.log(`🔧 Creating redirect for missing route: ${route.path}`);

        // Créer une redirection JavaScript
        const redirectScript = `
        // Redirect for ${route.path}
        if (window.location.pathname === '${route.path}') {
            console.log('Redirecting ${route.path} to /');
            window.location.href = '/';
        }
        `;

        const script = document.createElement('script');
        script.textContent = redirectScript;
        document.body.appendChild(script);

        this.fixes.push(`Created redirect for missing route: ${route.path}`);
    }

    // Correction lien cassé
    fixBrokenLink(issue) {
        const link = issue.link;
        console.log(`🔧 Fixing broken link: ${link.href}`);

        // Trouver et corriger le lien
        const linkElement = document.querySelector(`a[href="${link.href}"]`);
        if (linkElement) {
            // Ajouter un gestionnaire d'erreur
            linkElement.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Lien cassé: ${link.href}\nRedirection vers l'accueil.`);
                window.location.href = '/';
            });

            // Changer l'apparence
            linkElement.style.opacity = '0.6';
            linkElement.style.textDecoration = 'line-through';
            linkElement.title = 'Lien cassé - sera corrigé';

            this.fixes.push(`Added error handler for broken link: ${link.href}`);
        }
    }

    // Correction redirection manquante
    fixMissingRedirect(issue) {
        const redirect = issue.redirect;
        console.log(`🔧 Creating redirect: ${redirect.from} → ${redirect.to}`);

        const redirectScript = `
        // Redirect ${redirect.from} to ${redirect.to}
        if (window.location.pathname === '${redirect.from}') {
            console.log('Redirecting ${redirect.from} to ${redirect.to}');
            window.location.href = '${redirect.to}';
        }
        `;

        const script = document.createElement('script');
        script.textContent = redirectScript;
        document.body.appendChild(script);

        this.fixes.push(`Created redirect: ${redirect.from} → ${redirect.to}`);
    }

    // Correction erreur réseau
    fixNetworkError(issue) {
        const route = issue.route;
        console.log(`🔧 Creating network error fallback for: ${route.path}`);

        // Créer un fallback avec message d'erreur
        const errorScript = `
        // Network error fallback for ${route.path}
        if (window.location.pathname === '${route.path}') {
            console.error('Network error accessing ${route.path}');
            document.body.innerHTML = `
                <div style="
                    font-family: system-ui, -apple-system, sans-serif;
                    background: #0f172a;
                    color: #e2e8f0;
                    text-align: center;
                    padding: 50px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div>
                        <h1 style="color: #ef4444; margin-bottom: 20px;">Erreur de connexion</h1>
                        <p>Impossible d'accéder à la page <strong>${route.path}</strong></p>
                        <p>Vérifiez votre connexion internet et réessayez.</p>
                        <button onclick="window.location.href='/'" style="
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            margin-top: 20px;
                        ">Retour à l'accueil</button>
                    </div>
                </div>
            `;
        }
        `;

        const script = document.createElement('script');
        script.textContent = errorScript;
        document.body.appendChild(script);

        this.fixes.push(`Created network error fallback for: ${route.path}`);
    }

    // Méthode statique pour démarrer
    static start() {
        const fixer = new Page404Fixer();
        fixer.diagnoseAndFix();
        return fixer;
    }
}

// Auto-démarrage
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => Page404Fixer.start(), 1000);
        });
    } else {
        setTimeout(() => Page404Fixer.start(), 1000);
    }
}

console.log('🔧 Page 404 Fixer chargé et prêt !');
