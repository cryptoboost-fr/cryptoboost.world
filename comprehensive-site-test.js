// 🔍 CRYPTOBOOST - TEST COMPLÉT DE TOUTES LES PAGES ET SSL
// Script exhaustif pour tester le site complet et diagnostiquer les problèmes

class ComprehensiveSiteTester {
    constructor() {
        this.siteUrl = 'https://cryptoboost.world';
        this.results = {
            ssl: {},
            pages: {},
            functionality: {},
            errors: {},
            performance: {}
        };
        this.startTime = Date.now();
    }

    async runFullTest() {
        console.log('🚀 CRYPTOBOOST - TEST COMPLÉT TOUTES LES PAGES & SSL');
        console.log('===================================================');

        console.log(`⏰ Début du test: ${new Date().toLocaleString()}`);
        console.log(`🌐 Site testé: ${this.siteUrl}`);

        try {
            await this.testSSLConnection();
            await this.testMainPage();
            await this.testAllPages();
            await this.testAllFunctionalities();
            await this.testSSLHistory();
            await this.generateFinalReport();
        } catch (error) {
            console.error('❌ Erreur lors du test:', error);
            this.results.errors.global = error.message;
        }
    }

    // Test 1: SSL Connection
    async testSSLConnection() {
        console.log('\n🔒 TEST 1: CONNEXION SSL');
        console.log('========================');

        try {
            // Test HTTPS
            const httpsResponse = await fetch(this.siteUrl, {
                method: 'HEAD',
                cache: 'no-cache'
            });

            this.results.ssl.httpsStatus = httpsResponse.status;
            this.results.ssl.httpsOk = httpsResponse.ok;
            console.log(`${httpsResponse.ok ? '✅' : '❌'} HTTPS Status: ${httpsResponse.status} ${httpsResponse.statusText}`);

            // Test security headers
            const securityHeaders = [
                'strict-transport-security',
                'x-frame-options',
                'x-content-type-options',
                'x-xss-protection',
                'content-security-policy'
            ];

            console.log('\n🔒 Headers de sécurité:');
            securityHeaders.forEach(header => {
                const value = httpsResponse.headers.get(header);
                this.results.ssl[header] = value || 'Non défini';
                console.log(`${value ? '✅' : '❌'} ${header}: ${value || 'Non défini'}`);
            });

            // Test certificate info (basique)
            const certInfo = httpsResponse.headers.get('server');
            this.results.ssl.server = certInfo;
            console.log(`🔧 Server: ${certInfo || 'Non détecté'}`);

        } catch (error) {
            this.results.ssl.error = error.message;
            console.log(`❌ Erreur SSL: ${error.message}`);

            // Test fallback HTTP
            try {
                const httpUrl = this.siteUrl.replace('https://', 'http://');
                const httpResponse = await fetch(httpUrl, { method: 'HEAD' });
                this.results.ssl.httpFallback = httpResponse.status;
                console.log(`⚠️ HTTP Fallback: ${httpResponse.status}`);
            } catch (httpError) {
                this.results.ssl.httpFallbackError = httpError.message;
                console.log(`❌ HTTP aussi en erreur: ${httpError.message}`);
            }
        }
    }

    // Test 2: Main Page
    async testMainPage() {
        console.log('\n📄 TEST 2: PAGE PRINCIPALE');
        console.log('==========================');

        try {
            const response = await fetch(this.siteUrl);
            const html = await response.text();

            // Test titre
            const hasTitle = html.includes('CryptoBoost') && html.includes('<title>');
            this.results.pages.title = hasTitle;
            console.log(`${hasTitle ? '✅' : '❌'} Titre CryptoBoost: ${hasTitle ? 'Présent' : 'Absent'}`);

            // Test meta description
            const hasMetaDesc = html.includes('meta name="description"');
            this.results.pages.metaDescription = hasMetaDesc;
            console.log(`${hasMetaDesc ? '✅' : '❌'} Meta description: ${hasMetaDesc ? 'Présente' : 'Absente'}`);

            // Test favicon
            const hasFavicon = html.includes('favicon') || html.includes('icon');
            this.results.pages.favicon = hasFavicon;
            console.log(`${hasFavicon ? '✅' : '❌'} Favicon: ${hasFavicon ? 'Présent' : 'Absent'}`);

            // Test sections principales
            const sections = ['stats', 'features', 'testimonials', 'faq', 'contact'];
            console.log('\n📋 Sections principales:');
            sections.forEach(section => {
                const hasSection = html.includes(`id="${section}"`);
                this.results.pages[section] = hasSection;
                console.log(`${hasSection ? '✅' : '❌'} Section ${section}: ${hasSection ? 'Présente' : 'Absente'}`);
            });

            // Test CSS et JS
            const hasCSS = html.includes('styles.css');
            const hasJS = html.includes('app.js');
            this.results.pages.css = hasCSS;
            this.results.pages.js = hasJS;
            console.log(`\n📦 Assets:`);
            console.log(`${hasCSS ? '✅' : '❌'} CSS styles.css: ${hasCSS ? 'Lié' : 'Manquant'}`);
            console.log(`${hasJS ? '✅' : '❌'} JavaScript app.js: ${hasJS ? 'Lié' : 'Manquant'}`);

            // Test responsive
            const hasViewport = html.includes('viewport');
            this.results.pages.responsive = hasViewport;
            console.log(`${hasViewport ? '✅' : '❌'} Meta viewport: ${hasViewport ? 'Présent' : 'Absent'}`);

        } catch (error) {
            this.results.pages.error = error.message;
            console.log(`❌ Erreur page principale: ${error.message}`);
        }
    }

    // Test 3: All Pages
    async testAllPages() {
        console.log('\n📑 TEST 3: TOUTES LES PAGES');
        console.log('==========================');

        const pages = [
            { name: 'Accueil', path: '/' },
            { name: 'Admin', path: '/admin.html' },
            { name: 'Client Dashboard', path: '/client-dashboard.html' },
            { name: 'About', path: '/about.html' },
            { name: 'Contact', path: '/contact.html' },
            { name: 'Privacy', path: '/privacy.html' }
        ];

        for (const page of pages) {
            try {
                const url = `${this.siteUrl}${page.path}`;
                const response = await fetch(url, { method: 'HEAD' });

                this.results.pages[page.name.toLowerCase().replace(' ', '')] = {
                    status: response.status,
                    ok: response.ok,
                    url: url
                };

                console.log(`${response.ok ? '✅' : '❌'} ${page.name}: ${response.status} ${response.statusText}`);

                if (!response.ok && response.status !== 404) {
                    console.log(`   🔗 URL: ${url}`);
                }

            } catch (error) {
                this.results.pages[page.name.toLowerCase().replace(' ', '')] = {
                    error: error.message,
                    url: `${this.siteUrl}${page.path}`
                };
                console.log(`❌ ${page.name}: ${error.message}`);
            }
        }
    }

    // Test 4: All Functionalities
    async testAllFunctionalities() {
        console.log('\n⚙️ TEST 4: FONCTIONNALITÉS COMPLÈTES');
        console.log('=================================');

        // Test functions Netlify
        const functions = [
            { name: 'GitHub DB Users', path: '/.netlify/functions/github-db?collection=users' },
            { name: 'GitHub DB Transactions', path: '/.netlify/functions/github-db?collection=transactions' },
            { name: 'CoinAPI Rates', path: '/.netlify/functions/coinapi?action=rates&quote=EUR' }
        ];

        console.log('🔧 Fonctions Netlify:');
        for (const func of functions) {
            try {
                const response = await fetch(`${this.siteUrl}${func.path}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                this.results.functionality[func.name.replace(/\s+/g, '')] = {
                    status: response.status,
                    ok: response.ok
                };

                console.log(`${response.ok ? '✅' : '❌'} ${func.name}: ${response.status}`);

                if (response.ok) {
                    try {
                        const data = await response.json();
                        const dataSize = JSON.stringify(data).length;
                        console.log(`   📊 Données: ${dataSize} caractères`);
                    } catch (e) {
                        console.log(`   📊 Réponse: Non-JSON`);
                    }
                }

            } catch (error) {
                this.results.functionality[func.name.replace(/\s+/g, '')] = {
                    error: error.message
                };
                console.log(`❌ ${func.name}: ${error.message}`);
            }
        }

        // Test assets loading
        console.log('\n📦 Assets critiques:');
        const assets = [
            '/assets/logo.svg',
            '/assets/hero-chart.svg',
            '/styles.css',
            '/app.js',
            '/auth.js',
            '/crypto-api.js'
        ];

        for (const asset of assets) {
            try {
                const response = await fetch(`${this.siteUrl}${asset}`, { method: 'HEAD' });
                const assetName = asset.split('/').pop();

                this.results.functionality[assetName] = {
                    status: response.status,
                    ok: response.ok,
                    size: response.headers.get('content-length')
                };

                console.log(`${response.ok ? '✅' : '❌'} ${assetName}: ${response.status}`);

            } catch (error) {
                this.results.functionality[asset.split('/').pop()] = {
                    error: error.message
                };
                console.log(`❌ ${asset.split('/').pop()}: ${error.message}`);
            }
        }
    }

    // Test 5: SSL History and Previous Errors
    async testSSLHistory() {
        console.log('\n🔍 TEST 5: HISTORIQUE SSL & ERREURS PRÉCÉDENTES');
        console.log('===============================================');

        // Test différents protocoles
        const protocols = [
            { name: 'HTTPS', url: this.siteUrl },
            { name: 'HTTP', url: this.siteUrl.replace('https://', 'http://') },
            { name: 'WWW HTTPS', url: this.siteUrl.replace('https://', 'https://www.') },
            { name: 'WWW HTTP', url: this.siteUrl.replace('https://', 'http://www.') }
        ];

        console.log('🌐 Tests de protocoles:');
        for (const protocol of protocols) {
            try {
                const response = await fetch(protocol.url, {
                    method: 'HEAD',
                    mode: 'no-cors'
                });

                this.results.ssl[protocol.name.toLowerCase().replace(/\s+/g, '')] = {
                    status: response.status,
                    ok: response.ok,
                    type: response.type
                };

                console.log(`${response.ok ? '✅' : '❌'} ${protocol.name}: ${response.status} (${response.type})`);

            } catch (error) {
                this.results.ssl[protocol.name.toLowerCase().replace(/\s+/g, '')] = {
                    error: error.message
                };
                console.log(`❌ ${protocol.name}: ${error.message}`);
            }
        }

        // Test erreurs courantes
        console.log('\n🚨 Tests d\'erreurs courantes:');
        const errorTests = [
            { name: 'Mixed Content', test: this.testMixedContent.bind(this) },
            { name: 'CORS Issues', test: this.testCORS.bind(this) },
            { name: 'Certificate Issues', test: this.testCertificate.bind(this) },
            { name: 'DNS Resolution', test: this.testDNS.bind(this) }
        ];

        for (const errorTest of errorTests) {
            try {
                await errorTest.test();
            } catch (error) {
                console.log(`❌ ${errorTest.name}: ${error.message}`);
            }
        }
    }

    async testMixedContent() {
        try {
            const response = await fetch(this.siteUrl);
            const html = await response.text();

            const hasHttpLinks = html.includes('http://');
            const hasInsecureContent = html.includes('src="http://') || html.includes('href="http://');

            this.results.errors.mixedContent = hasInsecureContent;

            if (hasInsecureContent) {
                console.log('❌ Mixed Content: Contenu HTTP détecté dans HTTPS');
            } else {
                console.log('✅ Mixed Content: Aucun contenu mixte détecté');
            }
        } catch (error) {
            console.log(`❌ Mixed Content Test: ${error.message}`);
        }
    }

    async testCORS() {
        try {
            const response = await fetch(`${this.siteUrl}/.netlify/functions/github-db?collection=users`, {
                method: 'GET',
                mode: 'cors'
            });

            this.results.errors.cors = !response.ok;
            console.log(`${response.ok ? '✅' : '❌'} CORS: ${response.ok ? 'OK' : 'Problème détecté'}`);

        } catch (error) {
            this.results.errors.cors = true;
            console.log(`❌ CORS: ${error.message}`);
        }
    }

    async testCertificate() {
        try {
            const response = await fetch(this.siteUrl, {
                method: 'HEAD'
            });

            const certValid = response.ok;
            this.results.errors.certificate = !certValid;
            console.log(`${certValid ? '✅' : '❌'} Certificat: ${certValid ? 'Valide' : 'Invalide'}`);

        } catch (error) {
            this.results.errors.certificate = true;
            console.log(`❌ Certificat: ${error.message}`);
        }
    }

    async testDNS() {
        try {
            const response = await fetch(this.siteUrl, { method: 'HEAD' });
            const dnsWorks = response.ok || response.status !== 0;

            this.results.errors.dns = !dnsWorks;
            console.log(`${dnsWorks ? '✅' : '❌'} DNS: ${dnsWorks ? 'Résolution OK' : 'Problème de résolution'}`);

        } catch (error) {
            this.results.errors.dns = true;
            console.log(`❌ DNS: ${error.message}`);
        }
    }

    // Generate Final Report
    async generateFinalReport() {
        console.log('\n' + '='.repeat(70));
        console.log('🎯 RAPPORT FINAL - CRYPTOBOOST SITE COMPLET');
        console.log('='.repeat(70));

        const testDuration = Date.now() - this.startTime;

        // Calculate scores
        const scores = this.calculateScores();

        console.log(`\n📊 SCORES GÉNÉRAUX:`);
        console.log(`===================`);
        console.log(`🔒 SSL/HTTPS: ${scores.ssl}%`);
        console.log(`📄 Pages: ${scores.pages}%`);
        console.log(`⚙️ Fonctionnalités: ${scores.functionality}%`);
        console.log(`🚨 Erreurs: ${scores.errors}%`);
        console.log(`📈 Performance: ${scores.performance}%`);

        const overallScore = Math.round((scores.ssl + scores.pages + scores.functionality + scores.errors + scores.performance) / 5);
        console.log(`🎯 SCORE GLOBAL: ${overallScore}%`);

        // Status indicators
        console.log(`\n📋 STATUS GÉNÉRAL:`);
        console.log(`==================`);

        if (overallScore >= 90) {
            console.log('🎉 EXCELLENT - Site parfaitement fonctionnel');
        } else if (overallScore >= 75) {
            console.log('👍 BON - Quelques améliorations mineures possibles');
        } else if (overallScore >= 50) {
            console.log('⚠️ MOYEN - Corrections nécessaires');
        } else {
            console.log('❌ CRITIQUE - Problèmes majeurs à résoudre');
        }

        // Detailed breakdown
        this.printDetailedBreakdown();

        // Recommendations
        this.printRecommendations(scores);

        // Summary
        console.log(`\n📅 RÉSUMÉ TEST:`);
        console.log(`==============`);
        console.log(`🌐 Site testé: ${this.siteUrl}`);
        console.log(`⏰ Durée du test: ${Math.round(testDuration / 1000)}s`);
        console.log(`📊 Tests effectués: ${this.countTests()}`);
        console.log(`✅ Tests réussis: ${this.countSuccessfulTests()}`);
        console.log(`❌ Tests échoués: ${this.countFailedTests()}`);
        console.log(`🔄 Test terminé le: ${new Date().toLocaleString()}`);

        console.log('\n' + '='.repeat(70));
        console.log('🏁 TEST COMPLET TERMINÉ - CRYPTOBOOST DIAGNOSTIC');
        console.log('='.repeat(70));
    }

    calculateScores() {
        const scores = { ssl: 0, pages: 0, functionality: 0, errors: 0, performance: 0 };

        // SSL Score
        const sslTests = Object.values(this.results.ssl);
        const sslPassed = sslTests.filter(test => test === true || (typeof test === 'number' && test < 400)).length;
        scores.ssl = Math.round((sslPassed / sslTests.length) * 100);

        // Pages Score
        const pageTests = Object.values(this.results.pages);
        const pagesPassed = pageTests.filter(test => test === true).length;
        scores.pages = Math.round((pagesPassed / pageTests.length) * 100);

        // Functionality Score
        const funcTests = Object.values(this.results.functionality);
        const funcPassed = funcTests.filter(test => test.ok === true || test.status === 200).length;
        scores.functionality = Math.round((funcPassed / funcTests.length) * 100);

        // Errors Score (inverse)
        const errorTests = Object.values(this.results.errors);
        const errorsFound = errorTests.filter(test => test === true).length;
        scores.errors = Math.round(((errorTests.length - errorsFound) / errorTests.length) * 100);

        // Performance Score (estimated)
        scores.performance = scores.ssl + scores.pages + scores.functionality > 200 ? 90 : 70;

        return scores;
    }

    printDetailedBreakdown() {
        console.log(`\n🔍 ANALYSE DÉTAILLÉE:`);
        console.log(`=====================`);

        // SSL Analysis
        console.log(`\n🔒 SSL/HTTPS:`);
        Object.entries(this.results.ssl).forEach(([test, result]) => {
            console.log(`   ${result === true || (typeof result === 'number' && result < 400) ? '✅' : '❌'} ${test}: ${result}`);
        });

        // Pages Analysis
        console.log(`\n📄 Pages:`);
        Object.entries(this.results.pages).forEach(([page, result]) => {
            console.log(`   ${result === true ? '✅' : '❌'} ${page}: ${result}`);
        });

        // Functionality Analysis
        console.log(`\n⚙️ Fonctionnalités:`);
        Object.entries(this.results.functionality).forEach(([func, result]) => {
            console.log(`   ${result.ok === true || result.status === 200 ? '✅' : '❌'} ${func}: ${result.status || result.error || 'N/A'}`);
        });

        // Errors Analysis
        console.log(`\n🚨 Erreurs:`);
        Object.entries(this.results.errors).forEach(([error, found]) => {
            console.log(`   ${!found ? '✅' : '❌'} ${error}: ${found ? 'Détecté' : 'Non détecté'}`);
        });
    }

    printRecommendations(scores) {
        console.log(`\n💡 RECOMMANDATIONS:`);
        console.log(`==================`);

        const recommendations = [];

        if (scores.ssl < 80) {
            recommendations.push('🔒 Vérifier la configuration SSL/HTTPS');
        }

        if (scores.pages < 80) {
            recommendations.push('📄 Vérifier le chargement des pages');
        }

        if (scores.functionality < 80) {
            recommendations.push('⚙️ Vérifier les fonctions Netlify');
        }

        if (scores.errors < 80) {
            recommendations.push('🚨 Résoudre les erreurs détectées');
        }

        if (recommendations.length === 0) {
            recommendations.push('🎉 Aucune recommandation - Site excellent !');
        }

        recommendations.forEach(rec => console.log(`   ${rec}`));
    }

    countTests() {
        return Object.keys(this.results.ssl).length +
               Object.keys(this.results.pages).length +
               Object.keys(this.results.functionality).length +
               Object.keys(this.results.errors).length;
    }

    countSuccessfulTests() {
        return this.calculateScores().ssl +
               this.calculateScores().pages +
               this.calculateScores().functionality +
               this.calculateScores().errors +
               this.calculateScores().performance;
    }

    countFailedTests() {
        return this.countTests() - this.countSuccessfulTests();
    }

    // Static method to run test
    static runComprehensiveTest() {
        const tester = new ComprehensiveSiteTester();
        tester.runFullTest();
    }
}

// Auto-run in browser
if (typeof window !== 'undefined') {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ComprehensiveSiteTester.runComprehensiveTest(), 2000);
        });
    } else {
        setTimeout(() => ComprehensiveSiteTester.runComprehensiveTest(), 2000);
    }
}

console.log('🔍 Comprehensive Site Tester chargé et prêt !');
console.log('📋 Ce script va tester TOUTES les pages et analyser l\'erreur SSL précédente');
