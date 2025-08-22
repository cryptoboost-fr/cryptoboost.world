const puppeteer = require('puppeteer');
const SITE_URL = 'https://cryptoboost.world';
const TEST_USER = {
    email: `test_${Date.now()}@test.com`,
    password: 'TestPass123!',
    name: 'Test User'
};
const ADMIN_USER = {
    email: 'admin@cryptoboost.com',
    password: 'AdminPass123!'
};

async function runTests() {
    console.log('🚀 DÉMARRAGE DES TESTS LIVE CRYPTOBOOST');
    console.log('=====================================');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Test d'accès au site
        console.log('📡 Test de connexion au site...');
        await page.goto(SITE_URL);
        await page.waitForSelector('body');
        console.log('✅ Site accessible');

        // Test d'inscription
        console.log('👤 Test d\'inscription...');
        await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        });
        await page.evaluate(() => {
            document.querySelector('a[href="#register"], button:contains("Inscription"), .register-button')?.click();
        });
        await page.waitForSelector('form, input[type="email"]');
        await page.type('#registerEmail', TEST_USER.email);
        await page.type('#registerPassword', TEST_USER.password);
        await page.type('#registerName', TEST_USER.name);
        await page.click('#submitRegister');
        await page.waitForSelector('#dashboardWelcome');
        console.log('✅ Inscription réussie');

        // Test de déconnexion
        console.log(chalk.yellow('🚪 Test de déconnexion...'));
        await page.click('#logoutBtn');
        await page.waitForSelector('#loginBtn');
        console.log(chalk.green('✅ Déconnexion réussie'));

        // Test de connexion
        console.log(chalk.yellow('🔑 Test de connexion...'));
        await page.click('#loginBtn');
        await page.waitForSelector('#loginForm');
        await page.type('#loginEmail', TEST_USER.email);
        await page.type('#loginPassword', TEST_USER.password);
        await page.click('#submitLogin');
        await page.waitForSelector('#dashboardWelcome');
        console.log(chalk.green('✅ Connexion réussie'));

        // Test des fonctionnalités client
        console.log(chalk.yellow('💼 Test des fonctionnalités client...'));
        
        // Wallets
        await page.click('#walletsLink');
        await page.waitForSelector('#walletsPage');
        console.log(chalk.green('✅ Page Wallets accessible'));
        
        // Investissements
        await page.click('#investmentsLink');
        await page.waitForSelector('#investmentsPage');
        console.log(chalk.green('✅ Page Investissements accessible'));
        
        // Transactions
        await page.click('#transactionsLink');
        await page.waitForSelector('#transactionsPage');
        console.log(chalk.green('✅ Page Transactions accessible'));

        // Déconnexion pour tester l'admin
        await page.click('#logoutBtn');
        await page.waitForSelector('#loginBtn');

        // Test connexion admin
        console.log(chalk.yellow('👑 Test connexion admin...'));
        await page.click('#loginBtn');
        await page.waitForSelector('#loginForm');
        await page.type('#loginEmail', ADMIN_USER.email);
        await page.type('#loginPassword', ADMIN_USER.password);
        await page.click('#submitLogin');
        await page.waitForSelector('#adminDashboard');
        console.log(chalk.green('✅ Connexion admin réussie'));

        // Test des fonctionnalités admin
        console.log(chalk.yellow('⚙️ Test des fonctionnalités admin...'));
        
        // Gestion utilisateurs
        await page.click('#adminUsersLink');
        await page.waitForSelector('#usersManagement');
        console.log(chalk.green('✅ Gestion utilisateurs accessible'));
        
        // Gestion transactions
        await page.click('#adminTransactionsLink');
        await page.waitForSelector('#transactionsManagement');
        console.log(chalk.green('✅ Gestion transactions accessible'));
        
        // Gestion investissements
        await page.click('#adminInvestmentsLink');
        await page.waitForSelector('#investmentsManagement');
        console.log(chalk.green('✅ Gestion investissements accessible'));

        console.log(chalk.blue('\n✨ TOUS LES TESTS ONT RÉUSSI ✨'));

    } catch (error) {
        console.error('❌ ERREUR PENDANT LES TESTS:');
        console.error(error);
    } finally {
        await browser.close();
    }
}

// Installation des dépendances nécessaires
async function installDependencies() {
    const { execSync } = require('child_process');
    console.log('📦 Installation des dépendances...');
    try {
        execSync('npm install puppeteer --save-dev');
        console.log('✅ Dépendances installées');
    } catch (error) {
        console.error('❌ Erreur lors de l\'installation des dépendances:');
        console.error(error);
        process.exit(1);
    }
}

// Exécution des tests
(async () => {
    await installDependencies();
    await runTests();
})();
