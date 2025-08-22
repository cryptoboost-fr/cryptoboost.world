// 🚀 CRYPTOBOOST - VÉRIFICATION DÉPLOIEMENT NETLIFY
// Script pour vérifier l'état du déploiement et des fonctions

class NetlifyDeploymentChecker {
    constructor() {
        this.siteUrl = 'https://cryptoboost.world';
        this.apiUrl = 'https://api.netlify.com';
    }

    async checkDeploymentStatus() {
        console.log('🔍 VÉRIFICATION DÉPLOIEMENT NETLIFY');
        console.log('==================================');

        await this.checkSiteConnectivity();
        await this.checkAssetsLoading();
        await this.checkFunctionsStatus();
        await this.testAPIFunctions();
        await this.generateStatusReport();
    }

    async checkSiteConnectivity() {
        console.log('\n🌐 TEST 1: CONNECTIVITÉ SITE');
        console.log('===========================');

        try {
            const response = await fetch(this.siteUrl, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            console.log(`✅ Site accessible: ${response.status} ${response.statusText}`);
            console.log(`📊 Content-Type: ${response.headers.get('content-type')}`);
            console.log(`🔒 HTTPS: ${this.siteUrl.startsWith('https://')}`);

            // Vérifier le contenu HTML de base
            const html = await response.text();
            const hasTitle = html.includes('CryptoBoost');
            const hasMeta = html.includes('viewport');
            const hasFavicon = html.includes('favicon');

            console.log(`📄 Titre CryptoBoost: ${hasTitle ? '✅' : '❌'}`);
            console.log(`📱 Meta viewport: ${hasMeta ? '✅' : '❌'}`);
            console.log(`🎨 Favicon: ${hasFavicon ? '✅' : '❌'}`);

        } catch (error) {
            console.log(`❌ Erreur de connexion: ${error.message}`);
        }
    }

    async checkAssetsLoading() {
        console.log('\n📦 TEST 2: CHARGEMENT ASSETS');
        console.log('===========================');

        const assets = [
            { name: 'Logo SVG', path: '/assets/logo.svg' },
            { name: 'Hero Chart', path: '/assets/hero-chart.svg' },
            { name: 'CSS Styles', path: '/styles.css' },
            { name: 'App JS', path: '/app.js' },
            { name: 'Auth JS', path: '/auth.js' },
            { name: 'Crypto API', path: '/crypto-api.js' }
        ];

        for (const asset of assets) {
            try {
                const response = await fetch(`${this.siteUrl}${asset.path}`, {
                    method: 'HEAD',
                    cache: 'no-cache'
                });

                const status = response.ok ? '✅' : '❌';
                const size = response.headers.get('content-length');
                const type = response.headers.get('content-type');

                console.log(`${status} ${asset.name}: ${response.status} ${response.statusText}`);
                if (size) console.log(`   📊 Taille: ${Math.round(size/1024)} KB`);
                if (type) console.log(`   📋 Type: ${type}`);

            } catch (error) {
                console.log(`❌ ${asset.name}: ${error.message}`);
            }
        }
    }

    async checkFunctionsStatus() {
        console.log('\n⚙️ TEST 3: STATUS FONCTIONS');
        console.log('=========================');

        const functions = [
            { name: 'GitHub DB', path: '/.netlify/functions/github-db?collection=users' },
            { name: 'CoinAPI', path: '/.netlify/functions/coinapi?action=rates&quote=EUR' }
        ];

        for (const func of functions) {
            try {
                const response = await fetch(`${this.siteUrl}${func.path}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });

                const status = response.ok ? '✅' : '❌';
                console.log(`${status} ${func.name}: ${response.status} ${response.statusText}`);

                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    console.log(`   📋 Content-Type: ${contentType}`);

                    try {
                        const data = await response.json();
                        console.log(`   📊 Réponse: ${JSON.stringify(data).substring(0, 100)}...`);
                    } catch (e) {
                        const text = await response.text();
                        console.log(`   📊 Réponse: ${text.substring(0, 100)}...`);
                    }
                }

            } catch (error) {
                console.log(`❌ ${func.name}: ${error.message}`);
            }
        }
    }

    async testAPIFunctions() {
        console.log('\n🔗 TEST 4: TEST API FUNCTIONS');
        console.log('============================');

        // Test fonction GitHub DB
        try {
            console.log('Testing GitHub DB function...');
            const dbResponse = await fetch(`${this.siteUrl}/.netlify/functions/github-db?collection=users`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (dbResponse.ok) {
                const dbData = await dbResponse.json();
                console.log(`✅ GitHub DB Response: ${Object.keys(dbData).length} keys`);
            } else {
                console.log(`❌ GitHub DB Error: ${dbResponse.status}`);
            }
        } catch (error) {
            console.log(`❌ GitHub DB Function Error: ${error.message}`);
        }

        // Test fonction CoinAPI
        try {
            console.log('Testing CoinAPI function...');
            const coinResponse = await fetch(`${this.siteUrl}/.netlify/functions/coinapi?action=rates&quote=EUR`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (coinResponse.ok) {
                const coinData = await coinResponse.json();
                console.log(`✅ CoinAPI Response: ${Object.keys(coinData).length} currencies`);
            } else {
                console.log(`❌ CoinAPI Error: ${coinResponse.status}`);
            }
        } catch (error) {
            console.log(`❌ CoinAPI Function Error: ${error.message}`);
        }
    }

    async generateStatusReport() {
        console.log('\n📊 RAPPORT DÉPLOIEMENT NETLIFY');
        console.log('==============================');

        // Test de performance basique
        const startTime = performance.now();
        try {
            await fetch(this.siteUrl, { method: 'GET' });
            const loadTime = performance.now() - startTime;
            console.log(`⏱️ Temps de réponse: ${Math.round(loadTime)}ms`);
        } catch (error) {
            console.log(`❌ Erreur performance: ${error.message}`);
        }

        // Vérifier les headers de sécurité
        try {
            const securityResponse = await fetch(this.siteUrl, { method: 'HEAD' });
            const headers = securityResponse.headers;

            console.log('\n🔒 HEADERS SÉCURITÉ:');
            const securityHeaders = [
                'x-frame-options',
                'x-content-type-options',
                'x-xss-protection',
                'strict-transport-security'
            ];

            securityHeaders.forEach(header => {
                const value = headers.get(header);
                console.log(`${value ? '✅' : '❌'} ${header}: ${value || 'Non défini'}`);
            });

        } catch (error) {
            console.log(`❌ Erreur vérification sécurité: ${error.message}`);
        }

        console.log('\n📋 RÉSUMÉ DÉPLOIEMENT:');
        console.log('=====================');
        console.log(`🌐 Site URL: ${this.siteUrl}`);
        console.log(`⏰ Test effectué: ${new Date().toLocaleString()}`);
        console.log(`🔧 Fonctions testées: GitHub DB, CoinAPI`);
        console.log(`📦 Assets vérifiés: Logo, CSS, JavaScript`);
        console.log(`🔒 HTTPS: Activé`);
        console.log(`🚀 Status: ${await this.getOverallStatus()}`);
    }

    async getOverallStatus() {
        try {
            const response = await fetch(this.siteUrl);
            return response.ok ? '✅ DÉPLOIEMENT RÉUSSI' : '❌ PROBLÈMES DÉTECTÉS';
        } catch (error) {
            return '❌ SITE INACCESSIBLE';
        }
    }

    // Méthode pour tester depuis le navigateur
    static runBrowserTest() {
        const checker = new NetlifyDeploymentChecker();
        checker.checkDeploymentStatus();
    }
}

// Auto-démarrage pour navigateur
if (typeof window !== 'undefined') {
    // Attendre que la page soit chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => NetlifyDeploymentChecker.runBrowserTest(), 1000);
        });
    } else {
        setTimeout(() => NetlifyDeploymentChecker.runBrowserTest(), 1000);
    }
}

// Export pour Node.js si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetlifyDeploymentChecker;
}

console.log('🔧 Netlify Deployment Checker chargé et prêt !');
console.log('📋 Instructions: Copiez ce script dans la console du navigateur pour tester le déploiement');
