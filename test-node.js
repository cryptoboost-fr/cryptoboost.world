// Test Node.js pour CryptoBoost
const fs = require('fs');
const path = require('path');

console.log('🚀 TEST NODE.JS CRYPTOBOOST');
console.log('==========================');
console.log(`⏰ ${new Date().toLocaleString()}`);

// Lire les fichiers
const appJs = fs.readFileSync('app.js', 'utf8');
const authJs = fs.readFileSync('auth.js', 'utf8');

const tests = {
    app: {
        showLogin: /showLogin\s*\(\s*\)\s*{/,
        showRegister: /showRegister\s*\(\s*\)\s*{/,
        showDashboard: /showDashboard\s*\(\s*\)\s*{/,
        showDeposit: /showDeposit\s*\(\s*\)\s*{/,
        showWithdraw: /showWithdraw\s*\(\s*\)\s*{/,
        showExchange: /showExchange\s*\(\s*\)\s*{/
    },
    auth: {
        validateAuth: /validateAuth\s*\(\s*[^)]*\)\s*{/,
        getCurrentUser: /getCurrentUser\s*\(\s*\)\s*{/,
        protectPage: /protectPage\s*\(\s*[^)]*\)\s*{/,
        logout: /logout\s*\(\s*\)\s*{/
    }
};

console.log('\n📝 TEST DES FONCTIONS APP.JS');
console.log('===========================');
Object.entries(tests.app).forEach(([name, regex]) => {
    const exists = regex.test(appJs);
    console.log(`${exists ? '✅' : '❌'} Fonction ${name}`);
});

console.log('\n🔐 TEST DES FONCTIONS AUTH.JS');
console.log('===========================');
Object.entries(tests.auth).forEach(([name, regex]) => {
    const exists = regex.test(authJs);
    console.log(`${exists ? '✅' : '❌'} Fonction ${name}`);
});
