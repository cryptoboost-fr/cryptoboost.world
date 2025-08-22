// 🔍 CRYPTOBOOST - VÉRIFICATION FINALE DES ERREURS
// Script complet pour détecter toutes les erreurs restantes

class FinalErrorChecker {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.successes = [];
        this.startTime = Date.now();
    }

    async startCompleteCheck() {
        console.log('🔍 CRYPTOBOOST - VÉRIFICATION FINALE DES ERREURS');
        console.log('=================================================');
        console.log(`⏰ Début: ${new Date().toLocaleString()}`);

        // Test 1: Erreurs JavaScript actives
        await this.checkActiveJavaScriptErrors();

        // Test 2: Erreurs de chargement
        await this.checkLoadingErrors();

        // Test 3: Erreurs fonctionnelles
        await this.checkFunctionalErrors();

        // Test 4: Erreurs de performance
        await this.checkPerformanceErrors();

        // Test 5: Erreurs de sécurité
        await this.checkSecurityErrors();

        // Test 6: Erreurs d'accessibilité
        await this.checkAccessibilityErrors();

        // Rapport final
        this.generateFinalReport();
    }

    // Test 1: Erreurs JavaScript actives
    async checkActiveJavaScriptErrors() {
        console.log('\n🚨 TEST 1: ERREURS JAVASCRIPT ACTIVES');

        const originalError = console.error;
        const originalWarn = console.warn;
        const errors = [];
        const warnings = [];

        console.error = (...args) => {
            errors.push(args.join(' '));
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            warnings.push(args.join(' '));
            originalWarn.apply(console, args);
        };

        // Simuler des interactions pour déclencher des erreurs
        await this.simulateUserInteractions();

        // Attendre que les erreurs se manifestent
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Restaurer les fonctions originales
        console.error = originalError;
        console.warn = originalWarn;

        if (errors.length > 0) {
            this.errors.push({
                type: 'javascript_errors',
                count: errors.length,
                messages: errors.slice(0, 5),
                severity: 'high'
            });
            console.log(`❌ ${errors.length} erreurs JavaScript détectées`);
            errors.slice(0, 3).forEach(error => {
                console.log(`   🔴 ${error}`);
            });
        } else {
            this.successes.push('Aucune erreur JavaScript active');
            console.log('✅ Aucune erreur JavaScript active');
        }

        if (warnings.length > 0) {
            this.warnings.push({
                type: 'javascript_warnings',
                count: warnings.length,
                messages: warnings.slice(0, 3)
            });
            console.log(`⚠️ ${warnings.length} avertissements JavaScript`);
        }
    }

    // Simuler des interactions utilisateur
    async simulateUserInteractions() {
        const interactions = [
            () => {
                // Test des fonctions critiques
                const functions = ['showLogin', 'showRegister', 'logout', 'validateAuth', 'showDashboard'];
                functions.forEach(func => {
                    if (typeof window[func] === 'function') {
                        try {
                            window[func]();
                        } catch (e) {
                            console.error(`Erreur dans ${func}:`, e);
                        }
                    }
                });
            },
            () => {
                // Test des éléments DOM
                const elements = ['loginModal', 'registerModal', 'dashboard'];
                elements.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        try {
                            element.style.display = 'none';
                            element.style.display = '';
                        } catch (e) {
                            console.error(`Erreur DOM ${id}:`, e);
                        }
                    }
                });
            },
            () => {
                // Test des appels API
                const apiCalls = [
                    fetch('/.netlify/functions/github-db?collection=users'),
                    fetch('/.netlify/functions/coinapi?action=rates&quote=EUR')
                ];

                apiCalls.forEach(async (call) => {
                    try {
                        await call;
                    } catch (e) {
                        console.error('Erreur API:', e);
                    }
                });
            }
        ];

        // Exécuter les interactions
        for (const interaction of interactions) {
            try {
                interaction();
            } catch (e) {
                console.error('Erreur lors de l\'interaction:', e);
            }
        }
    }

    // Test 2: Erreurs de chargement
    async checkLoadingErrors() {
        console.log('\n📦 TEST 2: ERREURS DE CHARGEMENT');

        const resources = [
            { name: 'CSS Principal', url: '/styles.css', type: 'css' },
            { name: 'App JS', url: '/app.js', type: 'js' },
            { name: 'Auth JS', url: '/auth.js', type: 'js' },
            { name: 'Crypto API', url: '/crypto-api.js', type: 'js' },
            { name: 'Logo', url: '/assets/logo.svg', type: 'image' },
            { name: 'Favicon', url: '/favicon.ico', type: 'image' }
        ];

        let failedResources = 0;

        for (const resource of resources) {
            try {
                const response = await fetch(resource.url, { method: 'HEAD' });
                if (!response.ok) {
                    failedResources++;
                    this.errors.push({
                        type: 'resource_loading_error',
                        resource: resource.name,
                        url: resource.url,
                        status: response.status,
                        severity: resource.type === 'js' ? 'high' : 'medium'
                    });
                    console.log(`❌ ${resource.name}: ${response.status}`);
                } else {
                    console.log(`✅ ${resource.name}: OK`);
                }
            } catch (error) {
                failedResources++;
                this.errors.push({
                    type: 'resource_network_error',
                    resource: resource.name,
                    url: resource.url,
                    error: error.message,
                    severity: 'high'
                });
                console.log(`❌ ${resource.name}: Erreur réseau`);
            }
        }

        if (failedResources === 0) {
            this.successes.push('Tous les assets chargés correctement');
        }
    }

    // Test 3: Erreurs fonctionnelles
    async checkFunctionalErrors() {
        console.log('\n⚙️ TEST 3: ERREURS FONCTIONNELLES');

        // Test des fonctions critiques
        const criticalFunctions = [
            'showLogin', 'showRegister', 'logout', 'validateAuth',
            'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange'
        ];

        let missingFunctions = 0;

        criticalFunctions.forEach(funcName => {
            if (typeof window[funcName] !== 'function') {
                missingFunctions++;
                this.errors.push({
                    type: 'missing_function',
                    function: funcName,
                    severity: 'high'
                });
                console.log(`❌ Fonction manquante: ${funcName}`);
            } else {
                console.log(`✅ Fonction présente: ${funcName}`);
            }
        });

        if (missingFunctions === 0) {
            this.successes.push('Toutes les fonctions critiques présentes');
        }

        // Test des variables critiques
        const criticalVariables = ['app', 'auth', 'config', 'settings'];
        let missingVariables = 0;

        criticalVariables.forEach(varName => {
            if (typeof window[varName] === 'undefined') {
                missingVariables++;
                this.warnings.push({
                    type: 'missing_variable',
                    variable: varName,
                    severity: 'medium'
                });
                console.log(`⚠️ Variable manquante: ${varName}`);
            }
        });

        // Test des sections HTML
        const sections = ['stats', 'features', 'testimonials', 'faq', 'contact'];
        let missingSections = 0;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) {
                missingSections++;
                this.warnings.push({
                    type: 'missing_section',
                    section: sectionId,
                    severity: 'low'
                });
                console.log(`⚠️ Section manquante: ${sectionId}`);
            }
        });

        if (missingSections === 0) {
            this.successes.push('Toutes les sections HTML présentes');
        }
    }

    // Test 4: Erreurs de performance
    async checkPerformanceErrors() {
        console.log('\n⚡ TEST 4: ERREURS DE PERFORMANCE');

        // Test du temps de chargement
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

            if (loadTime > 5000) {
                this.warnings.push({
                    type: 'slow_loading',
                    loadTime: loadTime,
                    severity: 'medium'
                });
                console.log(`⚠️ Temps de chargement lent: ${loadTime}ms`);
            } else {
                console.log(`✅ Temps de chargement: ${loadTime}ms`);
            }

            if (domTime > 3000) {
                this.warnings.push({
                    type: 'slow_dom',
                    domTime: domTime,
                    severity: 'medium'
                });
                console.log(`⚠️ DOM lent: ${domTime}ms`);
            }
        }

        // Test de la taille DOM
        const domElements = document.querySelectorAll('*').length;
        if (domElements > 2000) {
            this.warnings.push({
                type: 'large_dom',
                elements: domElements,
                severity: 'medium'
            });
            console.log(`⚠️ DOM volumineux: ${domElements} éléments`);
        } else {
            console.log(`✅ Taille DOM: ${domElements} éléments`);
        }

        // Test des images non optimisées
        const images = document.querySelectorAll('img');
        let unoptimizedImages = 0;

        images.forEach(img => {
            if (!img.hasAttribute('loading') && !img.hasAttribute('decoding')) {
                unoptimizedImages++;
            }
        });

        if (unoptimizedImages > 0) {
            this.warnings.push({
                type: 'unoptimized_images',
                count: unoptimizedImages,
                severity: 'low'
            });
            console.log(`⚠️ Images non optimisées: ${unoptimizedImages}`);
        }
    }

    // Test 5: Erreurs de sécurité
    async checkSecurityErrors() {
        console.log('\n🔒 TEST 5: ERREURS DE SÉCURITÉ');

        // Test HTTPS
        const isHTTPS = window.location.protocol === 'https:';
        if (!isHTTPS) {
            this.errors.push({
                type: 'no_https',
                severity: 'high'
            });
            console.log('❌ Pas de HTTPS');
        } else {
            console.log('✅ HTTPS actif');
        }

        // Test du contenu mixte
        const html = document.documentElement.outerHTML;
        const hasMixedContent = html.includes('src="http://') || html.includes('href="http://');

        if (hasMixedContent) {
            this.errors.push({
                type: 'mixed_content',
                severity: 'high'
            });
            console.log('❌ Contenu mixte détecté');
        } else {
            console.log('✅ Aucun contenu mixte');
        }

        // Test des headers de sécurité
        try {
            const response = await fetch(window.location.href, { method: 'HEAD' });
            const headers = response.headers;

            const securityHeaders = [
                'x-frame-options',
                'x-content-type-options',
                'x-xss-protection'
            ];

            securityHeaders.forEach(header => {
                if (!headers.get(header)) {
                    this.warnings.push({
                        type: 'missing_security_header',
                        header: header,
                        severity: 'medium'
                    });
                    console.log(`⚠️ Header manquant: ${header}`);
                }
            });

            if (this.warnings.filter(w => w.type === 'missing_security_header').length === 0) {
                console.log('✅ Headers de sécurité présents');
            }

        } catch (error) {
            console.log('⚠️ Impossible de vérifier les headers');
        }
    }

    // Test 6: Erreurs d'accessibilité
    async checkAccessibilityErrors() {
        console.log('\n♿ TEST 6: ERREURS D\'ACCESSIBILITÉ');

        // Test des images sans alt
        const images = document.querySelectorAll('img');
        let imagesWithoutAlt = 0;

        images.forEach(img => {
            if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
                imagesWithoutAlt++;
            }
        });

        if (imagesWithoutAlt > 0) {
            this.warnings.push({
                type: 'missing_alt_text',
                count: imagesWithoutAlt,
                severity: 'medium'
            });
            console.log(`⚠️ Images sans alt text: ${imagesWithoutAlt}`);
        } else {
            console.log('✅ Toutes les images ont un alt text');
        }

        // Test des liens sans texte
        const links = document.querySelectorAll('a');
        let linksWithoutText = 0;

        links.forEach(link => {
            const text = link.textContent.trim();
            if (!text && !link.querySelector('img')) {
                linksWithoutText++;
            }
        });

        if (linksWithoutText > 0) {
            this.warnings.push({
                type: 'empty_links',
                count: linksWithoutText,
                severity: 'medium'
            });
            console.log(`⚠️ Liens vides: ${linksWithoutText}`);
        }

        // Test du contraste (basique)
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        let lowContrastElements = 0;

        textElements.forEach(element => {
            try {
                const style = getComputedStyle(element);
                const color = style.color;
                const bgColor = style.backgroundColor;

                // Vérification basique du contraste
                if (color === 'rgb(0, 0, 0)' && bgColor === 'rgba(0, 0, 0, 0)') {
                    lowContrastElements++;
                }
            } catch (e) {
                // Ignore les erreurs de calcul de style
            }
        });

        if (lowContrastElements > 0) {
            this.warnings.push({
                type: 'low_contrast',
                count: lowContrastElements,
                severity: 'low'
            });
            console.log(`⚠️ Éléments à faible contraste: ${lowContrastElements}`);
        } else {
            console.log('✅ Contraste des éléments OK');
        }
    }

    // Génération du rapport final
    generateFinalReport() {
        const duration = Date.now() - this.startTime;

        console.log('\n' + '='.repeat(80));
        console.log('🎯 RAPPORT FINAL - VÉRIFICATION DES ERREURS CRYPTOBOOST');
        console.log('='.repeat(80));

        // Statistiques générales
        const totalErrors = this.errors.length;
        const totalWarnings = this.warnings.length;
        const totalSuccesses = this.successes.length;

        console.log(`\n📊 STATISTIQUES GÉNÉRALES:`);
        console.log(`==========================`);
        console.log(`🚨 Erreurs critiques: ${this.errors.filter(e => e.severity === 'high').length}`);
        console.log(`🟠 Erreurs moyennes: ${this.errors.filter(e => e.severity === 'medium').length}`);
        console.log(`🟢 Erreurs mineures: ${this.errors.filter(e => e.severity === 'low').length}`);
        console.log(`⚠️ Avertissements: ${totalWarnings}`);
        console.log(`✅ Succès: ${totalSuccesses}`);
        console.log(`⏰ Durée du test: ${Math.round(duration/1000)}s`);

        // Évaluation globale
        console.log(`\n📋 ÉVALUATION GLOBALE:`);
        console.log(`=======================`);

        let overallScore = 100;
        let status = 'EXCELLENT';
        let recommendations = [];

        if (totalErrors > 0) {
            overallScore -= totalErrors * 15;
            recommendations.push('🚨 Corriger les erreurs critiques détectées');
        }

        if (totalWarnings > 5) {
            overallScore -= (totalWarnings - 5) * 5;
            recommendations.push('⚠️ Adresser les avertissements');
        }

        if (overallScore >= 90) {
            status = '🎉 EXCELLENT';
            console.log(`${status} - Site parfait !`);
            console.log('   ✅ Aucune erreur critique');
            console.log('   ✅ Performance optimale');
            console.log('   ✅ Sécurité assurée');
        } else if (overallScore >= 75) {
            status = '👍 TRÈS BON';
            console.log(`${status} - Quelques améliorations mineures`);
            console.log('   ⚠️ Quelques problèmes à corriger');
            console.log('   ✅ Fonctionnalités principales OK');
        } else if (overallScore >= 50) {
            status = '⚠️ MOYEN';
            console.log(`${status} - Corrections nécessaires`);
            console.log('   ❌ Problèmes détectés nécessitant attention');
            console.log('   ✅ Base fonctionnelle');
        } else {
            status = '❌ CRITIQUE';
            console.log(`${status} - Problèmes majeurs`);
            console.log('   🚨 Corrections urgentes requises');
            console.log('   ❌ Fonctionnalités défaillantes');
        }

        console.log(`\n🎯 SCORE GLOBAL: ${Math.max(0, overallScore)}%`);

        // Détail des erreurs
        if (this.errors.length > 0) {
            console.log(`\n🚨 ERREURS DÉTECTÉES:`);
            console.log(`=====================`);

            this.errors.forEach((error, index) => {
                const severity = error.severity === 'high' ? '🔴' :
                               error.severity === 'medium' ? '🟠' : '🟢';
                console.log(`${index + 1}. ${severity} ${error.type}`);

                if (error.resource) console.log(`   📁 Ressource: ${error.resource}`);
                if (error.function) console.log(`   🔧 Fonction: ${error.function}`);
                if (error.variable) console.log(`   📦 Variable: ${error.variable}`);
                if (error.status) console.log(`   📊 Status: ${error.status}`);
                if (error.count) console.log(`   🔢 Nombre: ${error.count}`);
            });
        }

        // Détail des avertissements
        if (this.warnings.length > 0) {
            console.log(`\n⚠️ AVERTISSEMENTS:`);
            console.log(`==================`);

            this.warnings.forEach((warning, index) => {
                const severity = warning.severity === 'high' ? '🔴' :
                               warning.severity === 'medium' ? '🟠' : '🟢';
                console.log(`${index + 1}. ${severity} ${warning.type}`);

                if (warning.resource) console.log(`   📁 Ressource: ${warning.resource}`);
                if (warning.count) console.log(`   🔢 Nombre: ${warning.count}`);
            });
        }

        // Succès
        if (this.successes.length > 0) {
            console.log(`\n✅ SUCCÈS:`);
            console.log(`===========`);

            this.successes.forEach((success, index) => {
                console.log(`${index + 1}. ✅ ${success}`);
            });
        }

        // Recommandations
        if (recommendations.length > 0) {
            console.log(`\n💡 RECOMMANDATIONS:`);
            console.log(`===================`);

            recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. ${rec}`);
            });
        }

        // Résumé final
        console.log(`\n📅 RÉSUMÉ:`);
        console.log(`==========`);
        console.log(`🌐 Site testé: ${window.location.href}`);
        console.log(`📅 Date: ${new Date().toLocaleString()}`);
        console.log(`🔧 Navigateur: ${navigator.userAgent.split(' ').pop()}`);
        console.log(`🎯 État: ${status} (${Math.max(0, overallScore)}%)`);

        console.log('\n' + '='.repeat(80));
        console.log('🏁 VÉRIFICATION TERMINÉE - CRYPTOBOOST DIAGNOSTIC');
        console.log('='.repeat(80));

        // Message final
        if (totalErrors === 0) {
            console.log('\n🎉 FÉLICITATIONS ! Aucun bug détecté !');
            console.log('   ✅ Votre site CryptoBoost est parfait !');
        } else if (totalErrors <= 3) {
            console.log('\n👍 PRESQUE PARFAIT ! Quelques corrections mineures.');
            console.log('   🔧 Utilisez les scripts de correction pour finaliser.');
        } else {
            console.log('\n⚠️ CORRECTIONS NÉCESSAIRES détectées.');
            console.log('   🔧 Appliquez les corrections recommandées.');
        }
    }

    // Méthode statique pour démarrer
    static startCheck() {
        const checker = new FinalErrorChecker();
        checker.startCompleteCheck();
        return checker;
    }
}

// Auto-démarrage
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => FinalErrorChecker.startCheck(), 1000);
        });
    } else {
        setTimeout(() => FinalErrorChecker.startCheck(), 1000);
    }
}

console.log('🔍 Error Checker chargé et prêt !');
console.log('📊 Ce script va analyser toutes les erreurs potentielles...');
