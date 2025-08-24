// Test end-to-end CryptoBoost (admin + client)
const puppeteer = require('puppeteer');

const SITE_URL = 'http://localhost:8888'; // Remplacez par l'URL Netlify si besoin
const ADMIN = { email: 'admin@cryptoboost.com', password: 'AdminPass123!' };
const CLIENT = { email: 'client@test.com', password: 'ClientPass123!' };

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Test client
  console.log('--- Test client ---');
  await page.goto(SITE_URL);
  await page.click('button.btn-primary'); // Connexion
  await page.waitForSelector('#loginModal');
  await page.type('#email', CLIENT.email);
  await page.type('#password', CLIENT.password);
  await page.click('#loginModal button[type="submit"]');
  await page.waitForSelector('#dashboard');
  console.log('Client connecté et dashboard affiché');

  // Test navigation client
  await page.click('button[onclick*="showDeposit"]');
  await page.waitForSelector('#depositModal');
  console.log('Modal dépôt client OK');
  await page.click('button[onclick*="closeDepositModal"]');

  await page.click('button[onclick*="showWithdraw"]');
  await page.waitForSelector('#withdrawModal');
  console.log('Modal retrait client OK');
  await page.click('button[onclick*="closeWithdrawModal"]');

  // Déconnexion client
  await page.click('button[onclick*="logout"]');
  await page.waitForSelector('#loginModal');
  console.log('Déconnexion client OK');

  // Test admin
  console.log('--- Test admin ---');
  await page.goto(SITE_URL + '/admin.html');
  await page.waitForSelector('#loginModal');
  await page.type('#email', ADMIN.email);
  await page.type('#password', ADMIN.password);
  await page.click('#loginModal button[type="submit"]');
  await page.waitForSelector('#admin-name');
  console.log('Admin connecté et dashboard affiché');

  // Navigation admin
  await page.click('button[onclick*="showAdminPage(\'users\')"]');
  await page.waitForSelector('#admin-users');
  console.log('Page admin utilisateurs OK');

  await page.click('button[onclick*="showAdminPage(\'transactions\')"]');
  await page.waitForSelector('#admin-transactions');
  console.log('Page admin transactions OK');

  await page.click('button[onclick*="showAdminPage(\'investments\')"]');
  await page.waitForSelector('#admin-investments');
  console.log('Page admin investissements OK');

  await browser.close();
  console.log('Tests end-to-end terminés');
})();
