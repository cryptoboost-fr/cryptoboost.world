// 🧪 TEST DES AMÉLIORATIONS VISUELLES CRYPTOBOOST
// Script de test pour vérifier les effets visuels Phase 1 & 2

console.log('🚀 TEST AMÉLIORATIONS VISUELLES CRYPTOBOOST v4.0');
console.log('===============================================');
console.log(`⏰ ${new Date().toLocaleString()}`);
console.log(`🌐 ${window.location.href}`);
console.log('');

let tests = 0;
let success = 0;
let errors = 0;
let warnings = 0;

function test(name, condition, severity = 'normal') {
    tests++;
    if (condition) {
        console.log(`✅ ${name}`);
        success++;
        return true;
    } else {
        const icon = severity === 'high' ? '❌' : severity === 'medium' ? '🟠' : '⚠️';
        console.log(`${icon} ${name}`);
        if (severity === 'high') errors++;
        else warnings++;
        return false;
    }
}

// ========================================
// TEST PHASE 1: AMÉLIORATIONS FONDAMENTALES
// ========================================

console.log('🎨 PHASE 1: AMÉLIORATIONS FONDAMENTALES');
console.log('--------------------------------------');

// 1. Skybox 3D animé
test('Skybox 3D animé', document.querySelector('.gradient-bg::after') ||
                       getComputedStyle(document.body).backgroundImage.includes('radial-gradient'));

// 2. Cartes Holographiques
test('Cartes holographiques', document.querySelectorAll('.crypto-card-holo').length > 0);

// 3. Boutons Liquides
test('Boutons liquides', document.querySelectorAll('.btn-liquid').length > 0);

// 4. Gradient Mesh Background
test('Gradient mesh background', getComputedStyle(document.body).backgroundImage.includes('radial-gradient'));

// 5. Texture de bruit animée
test('Texture de bruit animée', document.querySelectorAll('.noise-texture').length > 0);

// ========================================
// TEST PHASE 2: ANIMATIONS AVANCÉES
// ========================================

console.log('\n💫 PHASE 2: ANIMATIONS AVANCÉES');
console.log('-------------------------------');

// 6. Effet Magnétique
test('Effet magnétique', document.querySelectorAll('.magnetic-card').length > 0);

// 7. Rayons de Lumière Dynamiques
test('Rayons de lumière dynamiques', document.querySelectorAll('.light-rays').length > 0);

// 8. Texte Magnétique
test('Texte magnétique', document.querySelectorAll('.magnetic-text').length > 0);

// 9. Système de Particules Crypto
test('Particules crypto', document.querySelectorAll('.crypto-particles').length > 0);

// 10. Ombres Volumétriques
test('Ombres volumétriques', document.querySelectorAll('.volumetric-shadow').length > 0);

// ========================================
// TEST FONCTIONNALITÉS CSS
// ========================================

console.log('\n🎯 FONCTIONNALITÉS CSS');
console.log('--------------------');

// 11. Variables CSS personnalisées
const root = getComputedStyle(document.documentElement);
test('Variables CSS Phase 1', root.getPropertyValue('--holo-gradient').length > 0);
test('Variables CSS Phase 2', root.getPropertyValue('--mesh-bg').length > 0);

// 12. Animations CSS
const animations = [
    'skyboxRotate', 'holoShift', 'lightRayMove', 'float', 'noiseMove'
];
let animationCount = 0;
animations.forEach(anim => {
    if (document.styleSheets[0].cssRules.toString().includes(anim)) {
        animationCount++;
    }
});
test('Animations CSS', animationCount >= 3);

// ========================================
// TEST JAVASCRIPT ENHANCER
// ========================================

console.log('\n🔧 JAVASCRIPT ENHANCER');
console.log('---------------------');

// 13. Enhanced Interactions Script
test('Enhanced Interactions Script', typeof CryptoBoostEnhancer !== 'undefined');

// 14. Méthodes d'initialisation
if (typeof CryptoBoostEnhancer !== 'undefined') {
    const methods = ['setupMagneticEffects', 'setupDynamicLightRays', 'setupTypingEffect', 'setupCryptoParticleSystem', 'setupVolumetricShadows'];
    let methodCount = 0;
    methods.forEach(method => {
        if (CryptoBoostEnhancer.prototype[method]) {
            methodCount++;
        }
    });
    test('Méthodes Phase 2', methodCount >= 5);
} else {
    test('Méthodes Phase 2', false, 'medium');
}

// ========================================
// TEST INTERACTIVITÉ
// ========================================

console.log('\n🖱️ INTERACTIVITÉ');
console.log('---------------');

// 15. Événements de survol
let hoverEffects = 0;
document.querySelectorAll('.magnetic-card, .btn-liquid, .volumetric-shadow').forEach(el => {
    if (getComputedStyle(el).transitionDuration !== '0s') {
        hoverEffects++;
    }
});
test('Effets de survol', hoverEffects > 0);

// 16. Événements de curseur
test('Événements de curseur', document.querySelectorAll('.magnetic-card').length > 0);

// ========================================
// RÉSULTATS FINAUX
// ========================================

console.log('\n📊 RÉSULTATS FINAUX');
console.log('==================');

const totalTests = tests;
const successRate = Math.round((success / totalTests) * 100);

console.log(`📈 Taux de réussite: ${successRate}%`);
console.log(`✅ Tests réussis: ${success}/${totalTests}`);
console.log(`❌ Erreurs critiques: ${errors}`);
console.log(`⚠️ Avertissements: ${warnings}`);

if (successRate >= 80) {
    console.log('\n🎉 SUCCÈS ! Les améliorations visuelles sont bien implémentées !');
    console.log('✨ CryptoBoost v4.0 avec effets visuels avancés est prêt !');
} else if (successRate >= 60) {
    console.log('\n🟠 PARTIELLEMENT FONCTIONNEL');
    console.log('Quelques effets visuels peuvent ne pas fonctionner correctement');
} else {
    console.log('\n❌ PROBLÈMES DÉTECTÉS');
    console.log('Les améliorations visuelles nécessitent des corrections');
}

console.log('\n💡 CONSEILS DE DEBUG:');
console.log('- Vérifiez que styles.css est bien chargé');
console.log('- Vérifiez que enhanced-interactions.js est exécuté');
console.log('- Inspectez les classes CSS dans les éléments HTML');
console.log('- Consultez la console pour les erreurs JavaScript');

console.log('\n🚀 FIN DU TEST AMÉLIORATIONS VISUELLES');
