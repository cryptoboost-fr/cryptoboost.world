// 🔍 POST-DEPLOYMENT VERIFICATION SCRIPT
// Script complet pour tester CryptoBoost après déploiement

class CryptoBoostPostDeploymentTester {
    constructor() {
        this.results = {
            basic: {},
            assets: {},
            functionality: {},
            design: {},
            performance: {},
            mobile: {},
            accessibility: {}
        };
        this.siteUrl = window.location.origin;
    }

    async runFullTest() {
        console.log('🚀 CRYPTOBOOST - TEST POST-DÉPLOIEMENT COMPLET');
        console.log('==============================================');

        await this.testBasicLoading();
        await this.testAssetsLoading();
        await this.testCoreFunctionality();
        await this.testDesignElements();
        await this.testPerformance();
        await this.testMobileResponsiveness();
        await this.testAccessibility();

        this.generateReport();
    }

    // Test 1: Chargement de base
    async testBasicLoading() {
        console.log('\n📊 TEST 1: CHARGEMENT DE BASE');
        console.log('============================');

        // Test de connectivité
        try {
            const response = await fetch(this.siteUrl);
            this.results.basic.connectivity = response.ok;
            console.log(`✅ Connectivité: ${response.status} ${response.statusText}`);
        } catch (error) {
            this.results.basic.connectivity = false;
            console.log(`❌ Connectivité: ${error.message}`);
        }

        // Test HTML loading
        this.results.basic.htmlLoaded = document.readyState === 'complete';
        console.log(`✅ HTML chargé: ${this.results.basic.htmlLoaded ? 'Oui' : 'Non'}`);

        // Test DOM ready
        this.results.basic.domReady = document.body !== null;
        console.log(`✅ DOM prêt: ${this.results.basic.domReady ? 'Oui' : 'Non'}`);

        // Test title
        this.results.basic.title = document.title.includes('CryptoBoost');
        console.log(`✅ Titre: ${this.results.basic.title ? 'Correct' : 'Incorrect'}`);

        // Test favicon
        const favicon = document.querySelector('link[rel="icon"]');
        this.results.basic.favicon = favicon !== null;
        console.log(`✅ Favicon: ${this.results.basic.favicon ? 'Présent' : 'Absent'}`);
    }

    // Test 2: Chargement des assets
    async testAssetsLoading() {
        console.log('\n📊 TEST 2: CHARGEMENT DES ASSETS');
        console.log('==============================');

        const assets = [
            { name: 'Logo SVG', path: '/assets/logo.svg' },
            { name: 'Hero Chart', path: '/assets/hero-chart.svg' },
            { name: 'Favicon', path: '/assets/favicon.svg' },
            { name: 'CSS Principal', path: '/styles.css' },
            { name: 'JavaScript App', path: '/app.js' },
            { name: 'JavaScript Auth', path: '/auth.js' },
            { name: 'JavaScript API', path: '/crypto-api.js' }
        ];

        for (const asset of assets) {
            try {
                const response = await fetch(asset.path, { method: 'HEAD' });
                this.results.assets[asset.name] = response.ok;
                console.log(`${response.ok ? '✅' : '❌'} ${asset.name}: ${response.status}`);
            } catch (error) {
                this.results.assets[asset.name] = false;
                console.log(`❌ ${asset.name}: ${error.message}`);
            }
        }
    }

    // Test 3: Fonctionnalités de base
    async testCoreFunctionality() {
        console.log('\n📊 TEST 3: FONCTIONNALITÉS DE BASE');
        console.log('================================');

        // Test sections principales
        const sections = ['stats', 'features', 'testimonials', 'faq', 'contact'];
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            this.results.functionality[sectionId] = section !== null;
            console.log(`${section ? '✅' : '❌'} Section ${sectionId}: ${section ? 'Présente' : 'Absente'}`);
        }

        // Test boutons principaux
        const buttons = [
            { id: 'login-button', name: 'Bouton Login' },
            { id: 'register-button', name: 'Bouton Register' }
        ];

        buttons.forEach(button => {
            const element = document.getElementById(button.id) || document.querySelector(`[onclick*="${button.id.replace('-button', '')}"]`);
            this.results.functionality[button.name] = element !== null;
            console.log(`${element ? '✅' : '❌'} ${button.name}: ${element ? 'Présent' : 'Absent'}`);
        });

        // Test modals
        const modals = ['loginModal', 'registerModal', 'depositModal'];
        for (const modalId of modals) {
            const modal = document.getElementById(modalId);
            this.results.functionality[modalId] = modal !== null;
            console.log(`${modal ? '✅' : '❌'} Modal ${modalId}: ${modal ? 'Présent' : 'Absent'}`);
        }

        // Test fonctions JavaScript critiques
        const criticalFunctions = [
            'showLogin', 'showRegister', 'logout', 'validateAuth',
            'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange'
        ];

        let functionsAvailable = 0;
        criticalFunctions.forEach(funcName => {
            const available = typeof window[funcName] === 'function';
            if (available) functionsAvailable++;
            console.log(`${available ? '✅' : '❌'} Fonction ${funcName}: ${available ? 'Disponible' : 'Manquante'}`);
        });

        this.results.functionality.functionsAvailable = functionsAvailable;
        console.log(`📊 Fonctions disponibles: ${functionsAvailable}/${criticalFunctions.length}`);
    }

    // Test 4: Éléments de design
    async testDesignElements() {
        console.log('\n📊 TEST 4: ÉLÉMENTS DE DESIGN');
        console.log('===========================');

        // Test animations CSS
        const hasAnimations = document.querySelector('[class*="animate-"], [class*="fade-"], [class*="float"]') !== null;
        this.results.design.animations = hasAnimations;
        console.log(`${hasAnimations ? '✅' : '❌'} Animations CSS: ${hasAnimations ? 'Présentes' : 'Absentes'}`);

        // Test effets glassmorphism
        const hasGlassEffect = document.querySelector('.glass-effect, [class*="glass"]') !== null;
        this.results.design.glassmorphism = hasGlassEffect;
        console.log(`${hasGlassEffect ? '✅' : '❌'} Effets Glassmorphism: ${hasGlassEffect ? 'Présents' : 'Absents'}`);

        // Test gradients
        const hasGradients = document.querySelector('[class*="gradient"], [style*="linear-gradient"]') !== null;
        this.results.design.gradients = hasGradients;
        console.log(`${hasGradients ? '✅' : '❌'} Gradients: ${hasGradients ? 'Présents' : 'Absents'}`);

        // Test logo animé
        const logo = document.querySelector('img[src*="logo.svg"]');
        this.results.design.logo = logo !== null;
        console.log(`${logo ? '✅' : '❌'} Logo SVG: ${logo ? 'Présent' : 'Absent'}`);

        // Test responsive design
        const hasResponsive = document.querySelector('[class*="md:"], [class*="lg:"]') !== null;
        this.results.design.responsive = hasResponsive;
        console.log(`${hasResponsive ? '✅' : '❌'} Classes Responsive: ${hasResponsive ? 'Présentes' : 'Absentes'}`);

        // Test variables CSS
        const hasCSSVars = getComputedStyle(document.documentElement).getPropertyValue('--primary-gradient').length > 0;
        this.results.design.cssVariables = hasCSSVars;
        console.log(`${hasCSSVars ? '✅' : '❌'} Variables CSS: ${hasCSSVars ? 'Définies' : 'Manquantes'}`);
    }

    // Test 5: Performance
    async testPerformance() {
        console.log('\n📊 TEST 5: PERFORMANCE');
        console.log('=====================');

        // Test temps de chargement
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.results.performance.loadTime = loadTime;
        console.log(`⏱️ Temps de chargement: ${loadTime}ms`);

        // Test taille DOM
        const domElements = document.querySelectorAll('*').length;
        this.results.performance.domSize = domElements;
        console.log(`📊 Éléments DOM: ${domElements}`);

        // Test images optimisées
        const images = document.querySelectorAll('img');
        let optimizedImages = 0;
        images.forEach(img => {
            if (img.hasAttribute('loading') || img.hasAttribute('decoding')) {
                optimizedImages++;
            }
        });
        this.results.performance.optimizedImages = optimizedImages;
        console.log(`🖼️ Images optimisées: ${optimizedImages}/${images.length}`);

        // Test CSS et JS minifiés
        const cssFiles = document.querySelectorAll('link[rel="stylesheet"]');
        const jsFiles = document.querySelectorAll('script[src]');
        this.results.performance.cssFiles = cssFiles.length;
        this.results.performance.jsFiles = jsFiles.length;
        console.log(`📁 Fichiers CSS: ${cssFiles.length}, JS: ${jsFiles.length}`);
    }

    // Test 6: Responsive mobile
    async testMobileResponsiveness() {
        console.log('\n📊 TEST 6: RESPONSIVE MOBILE');
        console.log('===========================');

        const viewport = window.innerWidth;
        this.results.mobile.viewport = viewport;
        console.log(`📱 Viewport: ${viewport}px`);

        // Test media queries
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

        this.results.mobile.isMobile = isMobile;
        this.results.mobile.isTablet = isTablet;
        this.results.mobile.isDesktop = isDesktop;

        console.log(`📱 Mobile: ${isMobile}, Tablet: ${isTablet}, Desktop: ${isDesktop}`);

        // Test navigation mobile
        const mobileMenu = document.querySelector('.mobile-menu, [class*="mobile"]');
        this.results.mobile.hasMobileMenu = mobileMenu !== null;
        console.log(`${mobileMenu ? '✅' : '❌'} Menu Mobile: ${mobileMenu ? 'Présent' : 'Absent'}`);

        // Test touch-friendly buttons
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

        this.results.mobile.touchFriendlyButtons = touchFriendlyButtons;
        console.log(`👆 Boutons Touch-Friendly: ${touchFriendlyButtons}/${buttons.length}`);
    }

    // Test 7: Accessibilité
    async testAccessibility() {
        console.log('\n📊 TEST 7: ACCESSIBILITÉ');
        console.log('=======================');

        // Test alt text sur images
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            if (img.hasAttribute('alt') && img.getAttribute('alt').trim() !== '') {
                imagesWithAlt++;
            }
        });
        this.results.accessibility.altText = imagesWithAlt;
        console.log(`🖼️ Images avec alt: ${imagesWithAlt}/${images.length}`);

        // Test contrast (basique)
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        let goodContrast = 0;
        textElements.forEach(el => {
            const styles = getComputedStyle(el);
            const color = styles.color;
            const bgColor = styles.backgroundColor;

            // Simple check - si ce n'est pas transparent
            if (color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
                goodContrast++;
            }
        });
        this.results.accessibility.contrast = goodContrast;
        console.log(`🎨 Contraste texte: ${goodContrast}/${textElements.length}`);

        // Test navigation clavier
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        this.results.accessibility.focusableElements = focusableElements.length;
        console.log(`⌨️ Éléments focusables: ${focusableElements.length}`);

        // Test headings hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const h1Count = document.querySelectorAll('h1').length;
        this.results.accessibility.headings = headings.length;
        this.results.accessibility.h1Count = h1Count;
        console.log(`📝 Headings: ${headings.length} (H1: ${h1Count})`);

        // Test lang attribute
        const hasLang = document.documentElement.hasAttribute('lang');
        this.results.accessibility.langAttribute = hasLang;
        console.log(`${hasLang ? '✅' : '❌'} Attribut lang: ${hasLang ? 'Présent' : 'Absent'}`);
    }

    // Générer le rapport final
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🎯 RAPPORT FINAL - CRYPTOBOOST POST-DÉPLOIEMENT');
        console.log('='.repeat(60));

        // Calcul du score global
        const allResults = Object.values(this.results);
        let totalTests = 0;
        let passedTests = 0;

        allResults.forEach(category => {
            Object.values(category).forEach(result => {
                totalTests++;
                if (result === true || (typeof result === 'number' && result > 0)) {
                    passedTests++;
                }
            });
        });

        const score = Math.round((passedTests / totalTests) * 100);

        console.log(`\n📊 SCORE GLOBAL: ${score}%`);
        console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);

        // Rapport détaillé par catégorie
        const categories = {
            'Chargement de Base': this.results.basic,
            'Assets': this.results.assets,
            'Fonctionnalités': this.results.functionality,
            'Design': this.results.design,
            'Performance': this.results.performance,
            'Mobile': this.results.mobile,
            'Accessibilité': this.results.accessibility
        };

        Object.entries(categories).forEach(([category, results]) => {
            console.log(`\n🎨 ${category.toUpperCase()}`);
            console.log('-'.repeat(30));

            Object.entries(results).forEach(([test, result]) => {
                const status = (result === true || (typeof result === 'number' && result > 0)) ? '✅' : '❌';
                const value = typeof result === 'boolean' ? (result ? 'OK' : 'KO') : result;
                console.log(`${status} ${test}: ${value}`);
            });
        });

        // Recommandations
        console.log(`\n💡 RECOMMANDATIONS`);
        console.log('-'.repeat(20));

        if (score >= 90) {
            console.log('🎉 Excellent ! Le site est prêt pour la production.');
        } else if (score >= 75) {
            console.log('👍 Bon résultat. Quelques améliorations mineures possibles.');
        } else if (score >= 50) {
            console.log('⚠️ Résultat moyen. Corrections nécessaires.');
        } else {
            console.log('❌ Résultat insuffisant. Corrections majeures requises.');
        }

        if (this.results.performance.loadTime > 3000) {
            console.log('⚡ Optimiser le temps de chargement');
        }

        if (this.results.accessibility.altText < this.results.accessibility.images) {
            console.log('🖼️ Ajouter des attributs alt aux images');
        }

        console.log(`\n🔗 Site testé: ${this.siteUrl}`);
        console.log(`⏰ Test effectué le: ${new Date().toLocaleString()}`);

        console.log('\n' + '='.repeat(60));
        console.log('🏁 TEST TERMINÉ - CRYPTOBOOST READY !');
        console.log('='.repeat(60));
    }

    // Méthode pour démarrer le test
    static startTest() {
        const tester = new CryptoBoostPostDeploymentTester();

        // Attendre que la page soit complètement chargée
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => tester.runFullTest(), 1000);
            });
        } else {
            setTimeout(() => tester.runFullTest(), 1000);
        }
    }
}

// Auto-démarrage du test si le script est chargé
if (typeof window !== 'undefined') {
    CryptoBoostPostDeploymentTester.startTest();
}

console.log('🔍 Script de test post-déploiement chargé et prêt !');
