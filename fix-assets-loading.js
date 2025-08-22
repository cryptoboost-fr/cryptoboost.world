// 🔧 CORRECTION DES PROBLÈMES DE CHARGEMENT DES ASSETS
// Script pour diagnostiquer et corriger les problèmes d'assets

class AssetsFixer {
    constructor() {
        this.issues = [];
        this.fixes = [];
    }

    async diagnoseAndFix() {
        console.log('🔍 DIAGNOSTIC DES ASSETS CRYPTOBOOST');
        console.log('=====================================');

        await this.checkCriticalAssets();
        await this.checkImageLoading();
        await this.checkCSSLoading();
        await this.checkJSLoading();
        await this.checkFontLoading();
        await this.generateReport();

        if (this.issues.length > 0) {
            await this.applyFixes();
        }
    }

    // Vérification des assets critiques
    async checkCriticalAssets() {
        console.log('\n📦 VÉRIFICATION DES ASSETS CRITIQUES');

        const criticalAssets = [
            { name: 'Logo SVG', path: '/assets/logo.svg', type: 'image' },
            { name: 'Hero Chart', path: '/assets/hero-chart.svg', type: 'image' },
            { name: 'Favicon SVG', path: '/assets/favicon.svg', type: 'image' },
            { name: 'Favicon ICO', path: '/favicon.ico', type: 'image' },
            { name: 'CSS Styles', path: '/styles.css', type: 'css' },
            { name: 'App JS', path: '/app.js', type: 'js' },
            { name: 'Auth JS', path: '/auth.js', type: 'js' },
            { name: 'Crypto API', path: '/crypto-api.js', type: 'js' }
        ];

        for (const asset of criticalAssets) {
            try {
                const response = await fetch(asset.path, { method: 'HEAD' });
                const status = response.ok ? '✅' : '❌';

                console.log(`${status} ${asset.name}: ${response.status}`);

                if (!response.ok) {
                    this.issues.push({
                        type: 'missing_asset',
                        asset: asset,
                        status: response.status,
                        severity: asset.type === 'image' ? 'medium' : 'high'
                    });
                } else {
                    // Vérifier la taille
                    const size = response.headers.get('content-length');
                    if (size && parseInt(size) < 100) {
                        this.issues.push({
                            type: 'empty_asset',
                            asset: asset,
                            size: parseInt(size),
                            severity: 'medium'
                        });
                    }
                }

            } catch (error) {
                this.issues.push({
                    type: 'network_error',
                    asset: asset,
                    error: error.message,
                    severity: 'high'
                });
                console.log(`❌ ${asset.name}: Erreur réseau`);
            }
        }
    }

    // Vérification du chargement des images
    async checkImageLoading() {
        console.log('\n🖼️ VÉRIFICATION DES IMAGES');

        const images = document.querySelectorAll('img');
        console.log(`📊 ${images.length} images trouvées dans le DOM`);

        let loadedImages = 0;
        let failedImages = 0;

        for (const img of images) {
            const imgTester = new Image();

            await new Promise((resolve) => {
                imgTester.onload = () => {
                    loadedImages++;
                    resolve();
                };

                imgTester.onerror = () => {
                    failedImages++;
                    this.issues.push({
                        type: 'broken_image',
                        src: img.src,
                        alt: img.alt,
                        severity: 'medium'
                    });
                    resolve();
                };

                imgTester.src = img.src;
            });
        }

        console.log(`✅ Images chargées: ${loadedImages}`);
        console.log(`❌ Images en erreur: ${failedImages}`);

        if (failedImages > 0) {
            console.log('\n🔧 Images cassées détectées:');
            this.issues.filter(issue => issue.type === 'broken_image').forEach(issue => {
                console.log(`   - ${issue.src} (alt: "${issue.alt || 'N/A'}")`);
            });
        }
    }

    // Vérification du chargement CSS
    async checkCSSLoading() {
        console.log('\n🎨 VÉRIFICATION DU CSS');

        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        console.log(`📊 ${stylesheets.length} feuilles de style trouvées`);

        for (const sheet of stylesheets) {
            try {
                const response = await fetch(sheet.href, { method: 'HEAD' });
                const status = response.ok ? '✅' : '❌';
                console.log(`${status} ${sheet.href}: ${response.status}`);

                if (!response.ok) {
                    this.issues.push({
                        type: 'css_error',
                        href: sheet.href,
                        status: response.status,
                        severity: 'high'
                    });
                }

            } catch (error) {
                this.issues.push({
                    type: 'css_network_error',
                    href: sheet.href,
                    error: error.message,
                    severity: 'high'
                });
                console.log(`❌ ${sheet.href}: Erreur réseau`);
            }
        }

        // Vérifier les variables CSS critiques
        const root = getComputedStyle(document.documentElement);
        const criticalVars = [
            '--primary-gradient',
            '--glass-bg',
            '--shadow-light'
        ];

        console.log('\n🎨 Variables CSS critiques:');
        criticalVars.forEach(varName => {
            const value = root.getPropertyValue(varName);
            const status = value ? '✅' : '❌';
            console.log(`${status} ${varName}: ${value || 'Non défini'}`);

            if (!value) {
                this.issues.push({
                    type: 'missing_css_var',
                    variable: varName,
                    severity: 'medium'
                });
            }
        });
    }

    // Vérification du chargement JavaScript
    async checkJSLoading() {
        console.log('\n⚙️ VÉRIFICATION DU JAVASCRIPT');

        const scripts = document.querySelectorAll('script[src]');
        console.log(`📊 ${scripts.length} scripts externes trouvés`);

        for (const script of scripts) {
            try {
                const response = await fetch(script.src, { method: 'HEAD' });
                const status = response.ok ? '✅' : '❌';
                console.log(`${status} ${script.src}: ${response.status}`);

                if (!response.ok) {
                    this.issues.push({
                        type: 'js_error',
                        src: script.src,
                        status: response.status,
                        severity: 'high'
                    });
                }

            } catch (error) {
                this.issues.push({
                    type: 'js_network_error',
                    src: script.src,
                    error: error.message,
                    severity: 'high'
                });
                console.log(`❌ ${script.src}: Erreur réseau`);
            }
        }

        // Vérifier les fonctions critiques
        console.log('\n🔧 Fonctions JavaScript critiques:');
        const criticalFunctions = [
            'showLogin', 'showRegister', 'logout', 'validateAuth',
            'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange'
        ];

        criticalFunctions.forEach(funcName => {
            const exists = typeof window[funcName] === 'function';
            const status = exists ? '✅' : '❌';
            console.log(`${status} ${funcName}: ${exists ? 'Disponible' : 'Manquante'}`);

            if (!exists) {
                this.issues.push({
                    type: 'missing_function',
                    function: funcName,
                    severity: 'high'
                });
            }
        });
    }

    // Vérification du chargement des polices
    async checkFontLoading() {
        console.log('\n📝 VÉRIFICATION DES POLICES');

        // Vérifier les déclarations @font-face dans le CSS
        const stylesheets = Array.from(document.styleSheets);
        let fontFaces = 0;

        for (const sheet of stylesheets) {
            try {
                const rules = Array.from(sheet.cssRules || []);
                fontFaces += rules.filter(rule => rule.type === CSSRule.FONT_FACE_RULE).length;
            } catch (e) {
                // Ignore CORS errors for external stylesheets
            }
        }

        console.log(`📊 Règles @font-face trouvées: ${fontFaces}`);

        // Vérifier le chargement des polices Google Fonts si présentes
        const googleFontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        console.log(`🔗 Google Fonts links: ${googleFontLinks.length}`);

        if (googleFontLinks.length > 0) {
            for (const link of googleFontLinks) {
                try {
                    const response = await fetch(link.href, { method: 'HEAD' });
                    const status = response.ok ? '✅' : '❌';
                    console.log(`${status} Google Fonts: ${response.status}`);
                } catch (error) {
                    console.log(`❌ Google Fonts: Erreur réseau`);
                }
            }
        }
    }

    // Génération du rapport
    generateReport() {
        console.log('\n📋 RAPPORT DE DIAGNOSTIC');
        console.log('=========================');

        const severityCount = { high: 0, medium: 0, low: 0 };

        this.issues.forEach(issue => {
            severityCount[issue.severity]++;
        });

        console.log(`🔴 Problèmes critiques: ${severityCount.high}`);
        console.log(`🟠 Problèmes moyens: ${severityCount.medium}`);
        console.log(`🟢 Problèmes mineurs: ${severityCount.low}`);
        console.log(`📊 Total problèmes: ${this.issues.length}`);

        if (this.issues.length > 0) {
            console.log('\n🚨 PROBLÈMES DÉTECTÉS PAR CATÉGORIE:');

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
                    const asset = issue.asset || issue;
                    const name = asset.name || asset.src || asset.href || asset.function || asset.variable;
                    console.log(`   ${severity} ${name}`);
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
            case 'missing_asset':
                await this.createMissingAsset(issue.asset);
                break;

            case 'broken_image':
                this.fixBrokenImage(issue);
                break;

            case 'css_error':
                await this.fixCSSError(issue);
                break;

            case 'js_error':
                await this.fixJSError(issue);
                break;

            case 'missing_css_var':
                this.fixMissingCSSVar(issue);
                break;

            case 'missing_function':
                this.createMissingFunction(issue);
                break;
        }
    }

    // Création d'assets manquants
    async createMissingAsset(asset) {
        if (asset.type === 'image') {
            this.createPlaceholderImage(asset);
        } else if (asset.type === 'css') {
            this.createFallbackCSS(asset);
        } else if (asset.type === 'js') {
            this.createFallbackJS(asset);
        }

        this.fixes.push(`Created fallback for ${asset.name}`);
    }

    createPlaceholderImage(asset) {
        // Créer une image SVG de fallback
        const fallbackSvg = `
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#f3f4f6"/>
            <text x="100" y="95" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
                Image not found
            </text>
            <text x="100" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
                ${asset.path}
            </text>
        </svg>`;

        // Remplacer les images cassées par le fallback
        document.querySelectorAll(`img[src="${asset.path}"]`).forEach(img => {
            img.src = 'data:image/svg+xml;base64,' + btoa(fallbackSvg);
            img.alt = 'Image not available';
        });
    }

    createFallbackCSS(asset) {
        const fallbackCSS = `
        /* Fallback CSS for ${asset.path} */
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
        }

        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card-hover {
            transition: all 0.3s ease;
        }

        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        `;

        // Injecter le CSS fallback
        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);
    }

    createFallbackJS(asset) {
        let fallbackCode = '';

        if (asset.path.includes('app.js')) {
            fallbackCode = `
            // Fallback for app.js
            window.showLogin = function() {
                alert('Login modal not available - using fallback');
            };
            window.showRegister = function() {
                alert('Register modal not available - using fallback');
            };
            window.showDashboard = function() {
                alert('Dashboard not available - using fallback');
            };
            `;
        } else if (asset.path.includes('auth.js')) {
            fallbackCode = `
            // Fallback for auth.js
            window.validateAuth = function() {
                return false; // Not authenticated
            };
            window.logout = function() {
                alert('Logout functionality not available');
            };
            `;
        }

        if (fallbackCode) {
            const script = document.createElement('script');
            script.textContent = fallbackCode;
            document.body.appendChild(script);
        }
    }

    fixBrokenImage(issue) {
        const fallbackSvg = `
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#f3f4f6" rx="8"/>
            <text x="100" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
                Image not available
            </text>
            <text x="100" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
                ${issue.alt || 'No description'}
            </text>
        </svg>`;

        document.querySelectorAll(`img[src="${issue.src}"]`).forEach(img => {
            img.src = 'data:image/svg+xml;base64,' + btoa(fallbackSvg);
            img.alt = 'Image not available';
        });

        this.fixes.push(`Fixed broken image: ${issue.src}`);
    }

    fixMissingCSSVar(issue) {
        const fallbackVars = {
            '--primary-gradient': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            '--glass-bg': 'rgba(255, 255, 255, 0.1)',
            '--shadow-light': '0 4px 20px rgba(99, 102, 241, 0.15)'
        };

        if (fallbackVars[issue.variable]) {
            document.documentElement.style.setProperty(issue.variable, fallbackVars[issue.variable]);
            this.fixes.push(`Added fallback CSS variable: ${issue.variable}`);
        }
    }

    createMissingFunction(issue) {
        const fallbackFunctions = {
            'showLogin': 'function() { alert("Login modal not available - please refresh the page"); }',
            'showRegister': 'function() { alert("Register modal not available - please refresh the page"); }',
            'showDashboard': 'function() { alert("Dashboard not available - please refresh the page"); }',
            'validateAuth': 'function() { return false; }',
            'logout': 'function() { alert("Logout functionality not available"); }'
        };

        if (fallbackFunctions[issue.function]) {
            const script = document.createElement('script');
            script.textContent = `window.${issue.function} = ${fallbackFunctions[issue.function]};`;
            document.body.appendChild(script);
            this.fixes.push(`Created fallback function: ${issue.function}`);
        }
    }

    // Méthode statique pour démarrer le diagnostic
    static startDiagnosis() {
        const fixer = new AssetsFixer();
        fixer.diagnoseAndFix();
    }
}

// Auto-démarrage
if (typeof window !== 'undefined') {
    // Attendre que la page soit chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => AssetsFixer.startDiagnosis(), 1000);
        });
    } else {
        setTimeout(() => AssetsFixer.startDiagnosis(), 1000);
    }
}

console.log('🔧 Assets Fixer chargé et prêt pour le diagnostic !');
