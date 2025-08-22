// 🧪 TEST RAPIDE CRYPTOBOOST LIVE - VERSION SIMPLE
// Copiez-collez ce script dans la console sur https://cryptoboost.world

console.log('🚀 CRYPTOBOOST LIVE TEST');
console.log('=======================');
console.log(`⏰ ${new Date().toLocaleString()}`);
console.log(`🌐 ${window.location.href}`);

let score = 0;
const total = 10;

// 1. Test de base
console.log('\n📋 1. TESTS DE BASE');
score += document.title.includes('CryptoBoost') ? 1 : 0;
console.log(`✅ Titre: ${document.title.includes('CryptoBoost') ? 'OK' : '❌'}`);

score += window.location.protocol === 'https:' ? 1 : 0;
console.log(`✅ HTTPS: ${window.location.protocol === 'https:' ? 'OK' : '❌'}`);

score += !!document.querySelector('meta[name="viewport"]') ? 1 : 0;
console.log(`✅ Mobile: ${!!document.querySelector('meta[name="viewport"]') ? 'OK' : '❌'}`);

// 2. Test CSS
console.log('\n🎨 2. TESTS CSS');
score += !!document.querySelector('link[href*="styles.css"]') ? 1 : 0;
console.log(`✅ Styles: ${!!document.querySelector('link[href*="styles.css"]') ? 'OK' : '❌'}`);

// Variables CSS
const body = document.body;
const style = getComputedStyle(body);
score += style.getPropertyValue('--crypto-primary').length > 0 ? 1 : 0;
console.log(`✅ Variables CSS: ${style.getPropertyValue('--crypto-primary').length > 0 ? 'OK' : '❌'}`);

// 3. Test JavaScript
console.log('\n⚙️ 3. TESTS JAVASCRIPT');
const functions = ['showLogin', 'showRegister', 'validateAuth', 'showDashboard'];
let jsScore = 0;
functions.forEach(f => {
    if (typeof window[f] === 'function') jsScore++;
});
score += jsScore >= 3 ? 1 : 0;
console.log(`✅ Fonctions JS: ${jsScore}/4 fonctions OK`);

// 4. Test Modals
console.log('\n📱 4. TESTS MODALS');
score += !!document.getElementById('loginModal') ? 1 : 0;
console.log(`✅ Modal Login: ${!!document.getElementById('loginModal') ? 'OK' : '❌'}`);

score += !!document.getElementById('registerModal') ? 1 : 0;
console.log(`✅ Modal Register: ${!!document.getElementById('registerModal') ? 'OK' : '❌'}`);

// 5. Test Sections
console.log('\n📄 5. TESTS SECTIONS');
const sections = ['hero', 'features', 'stats', 'contact'];
let sectionsScore = 0;
sections.forEach(s => {
    if (document.getElementById(s)) sectionsScore++;
});
score += sectionsScore >= 3 ? 1 : 0;
console.log(`✅ Sections: ${sectionsScore}/4 sections OK`);

// 6. Test Crypto
console.log('\n💰 6. TESTS CRYPTO');
const cryptoText = document.body.textContent;
const cryptos = ['BTC', 'ETH', 'USDT', 'USDC'];
let cryptoScore = 0;
cryptos.forEach(c => {
    if (cryptoText.includes(c)) cryptoScore++;
});
score += cryptoScore >= 3 ? 1 : 0;
console.log(`✅ Cryptos: ${cryptoScore}/4 cryptos OK`);

// 7. Test APIs (async)
console.log('\n🔗 7. TESTS APIs');
setTimeout(async () => {
    try {
        const response = await fetch('/.netlify/functions/github-db?collection=users');
        console.log(`✅ API GitHub: ${response.ok ? 'OK' : '❌'}`);
        if (response.ok) score++;
    } catch (e) {
        console.log('❌ API GitHub: Erreur');
    }

    try {
        const response = await fetch('/.netlify/functions/coinapi?action=rates&quote=EUR');
        console.log(`✅ API CoinAPI: ${response.ok ? 'OK' : '❌'}`);
        if (response.ok) score++;
    } catch (e) {
        console.log('❌ API CoinAPI: Erreur');
    }

    // Rapport final
    setTimeout(() => {
        const percentage = Math.round((score / total) * 100);

        console.log('\n' + '='.repeat(50));
        console.log('🎯 RAPPORT FINAL CRYPTOBOOST LIVE');
        console.log('='.repeat(50));
        console.log(`📊 Score: ${score}/${total} (${percentage}%)`);
        console.log(`📅 Testé le: ${new Date().toLocaleString()}`);
        console.log(`🌐 URL: ${window.location.href}`);

        if (percentage >= 90) {
            console.log('🎉 PARFAIT ! Site 100% fonctionnel');
            console.log('✅ Prêt pour la production');
        } else if (percentage >= 80) {
            console.log('👍 TRES BON - Quelques améliorations');
        } else if (percentage >= 70) {
            console.log('🟡 BON - Corrections mineures');
        } else {
            console.log('❌ A AMELIORER - Corrections necessaires');
        }

        console.log('='.repeat(50));
        console.log('🏁 TEST TERMINE');
        console.log('='.repeat(50));
    }, 2000);
}, 1000);

console.log('\n⏳ Test en cours... Rapport complet dans 5 secondes...');
