# 🚀 TEST LOCAL CRYPTOBOOST - LANCEMENT IMMÉDIAT
# Script PowerShell pour tester localement CryptoBoost

Write-Host "🚀 TEST LOCAL CRYPTOBOOST - LANCEMENT IMMÉDIAT" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "⏰ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "📁 Dossier: $(Get-Location)" -ForegroundColor Cyan

$tests = 0
$success = 0
$errors = 0
$warnings = 0

function Test-Item {
    param([string]$name, [bool]$condition, [string]$severity = 'normal')
    $script:tests++
    if ($condition) {
        Write-Host "✅ $name" -ForegroundColor Green
        $script:success++
        return $true
    } else {
        $color = if ($severity -eq 'high') { 'Red' } elseif ($severity -eq 'medium') { 'Yellow' } else { 'Gray' }
        $icon = if ($severity -eq 'high') { '❌' } elseif ($severity -eq 'medium') { '🟠' } else { '⚠️' }
        Write-Host "$icon $name" -ForegroundColor $color
        if ($severity -eq 'high') { $script:errors++ } else { $script:warnings++ }
        return $false
    }
}

# Test 1: Structure du projet
Write-Host "`n📁 TEST 1: STRUCTURE DU PROJET" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

# Vérifier les fichiers critiques
$criticalFiles = @(
    @{ name = 'index.html'; path = 'index.html'; critical = $true },
    @{ name = 'styles.css'; path = 'styles.css'; critical = $true },
    @{ name = 'app.js'; path = 'app.js'; critical = $true },
    @{ name = 'auth.js'; path = 'auth.js'; critical = $true },
    @{ name = 'admin.js'; path = 'admin.js'; critical = $true },
    @{ name = 'netlify.toml'; path = 'netlify.toml'; critical = $true }
)

foreach ($file in $criticalFiles) {
    $exists = Test-Path $file.path
    Test-Item -name "Fichier $($file.name)" -condition $exists -severity $(if ($file.critical) { 'high' } else { 'medium' })
}

# Test 2: Pages HTML
Write-Host "`n📄 TEST 2: PAGES HTML" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue

$htmlPages = @(
    @{ name = 'Accueil'; path = 'index.html' },
    @{ name = 'À propos'; path = 'about.html' },
    @{ name = 'Contact'; path = 'contact.html' },
    @{ name = 'CGU'; path = 'cgu.html' },
    @{ name = 'Cookies'; path = 'cookies.html' },
    @{ name = 'Politique de confidentialité'; path = 'privacy.html' },
    @{ name = 'Dashboard Client'; path = 'client-dashboard.html' },
    @{ name = 'Investissements Client'; path = 'client-investments.html' },
    @{ name = 'Transactions Client'; path = 'client-transactions.html' },
    @{ name = 'Wallets Client'; path = 'client-wallets.html' },
    @{ name = 'Notifications Client'; path = 'client-notifications.html' },
    @{ name = 'Profil Client'; path = 'client-profile.html' },
    @{ name = 'Support Client'; path = 'client-support.html' },
    @{ name = 'Dashboard Admin'; path = 'admin.html' },
    @{ name = 'Utilisateurs Admin'; path = 'admin-users.html' },
    @{ name = 'Transactions Admin'; path = 'admin-transactions.html' },
    @{ name = 'Investissements Admin'; path = 'admin-investments.html' },
    @{ name = 'Wallets Admin'; path = 'admin-wallets.html' },
    @{ name = 'Rapports Admin'; path = 'admin-reports.html' },
    @{ name = 'Paramètres Admin'; path = 'admin-settings.html' }
)

foreach ($page in $htmlPages) {
    $exists = Test-Path $page.path
    $severity = if ($page.path -match 'admin|client') { 'medium' } else { 'high' }
    Test-Item -name "Page $($page.name)" -condition $exists -severity $severity
}

# Test 3: Fonctions Netlify
Write-Host "`n🔗 TEST 3: FONCTIONS NETLIFY" -ForegroundColor Blue
Write-Host "===========================" -ForegroundColor Blue

$netlifyFunctions = @(
    @{ name = 'GitHub DB'; path = 'functions/github-db.js' },
    @{ name = 'CoinAPI'; path = 'functions/coinapi.js' },
    @{ name = 'GitHub DB Enhanced'; path = 'functions/github-db-enhanced.js' },
    @{ name = 'CoinAPI Enhanced'; path = 'functions/coinapi-enhanced.js' }
)

foreach ($func in $netlifyFunctions) {
    $exists = Test-Path $func.path
    Test-Item -name "Fonction $($func.name)" -condition $exists -severity 'high'
}

# Test 4: Assets
Write-Host "`n🖼️ TEST 4: ASSETS ET RESSOURCES" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

$assets = @(
    @{ name = 'Logo SVG'; path = 'assets/logo.svg' },
    @{ name = 'Hero Chart'; path = 'assets/hero-chart.svg' },
    @{ name = 'Favicon'; path = 'assets/favicon.svg' },
    @{ name = 'Animations CSS'; path = 'assets/enhanced-animations.css' },
    @{ name = 'Interactions JS'; path = 'assets/enhanced-interactions.js' }
)

foreach ($asset in $assets) {
    $exists = Test-Path $asset.path
    $severity = if ($asset.path -match 'logo') { 'high' } else { 'medium' }
    Test-Item -name $asset.name -condition $exists -severity $severity
}

# Test 5: Scripts de test
Write-Host "`n🧪 TEST 5: SCRIPTS DE TEST" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue

$testScripts = @(
    @{ name = 'Test Complet'; path = 'test-complet-cryptoboost.js' },
    @{ name = 'Diagnostic Console'; path = 'diagnostic-console.js' },
    @{ name = 'Diagnostic Rapide'; path = 'diagnostic-rapide.js' },
    @{ name = 'Vérification Erreurs'; path = 'final-error-check.js' },
    @{ name = 'Test Site Live'; path = 'live-site-quick-test.js' }
)

foreach ($script in $testScripts) {
    $exists = Test-Path $script.path
    Test-Item -name $script.name -condition $exists -severity 'medium'
}

# Test 6: Scripts de correction
Write-Host "`n🔧 TEST 6: SCRIPTS DE CORRECTION" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

$fixScripts = @(
    @{ name = 'Correction Assets'; path = 'fix-assets-loading.js' },
    @{ name = 'Correction JS Errors'; path = 'fix-js-errors.js' },
    @{ name = 'Correction 404'; path = 'fix-404-pages.js' },
    @{ name = 'Corrections Complètes'; path = 'final-bug-fixes-complete.js' },
    @{ name = 'Guide Corrections'; path = 'bug-fixes-guide-complete.md' }
)

foreach ($script in $fixScripts) {
    $exists = Test-Path $script.path
    Test-Item -name $script.name -condition $exists -severity 'medium'
}

# Test 7: Configuration
Write-Host "`n⚙️ TEST 7: CONFIGURATION" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue

$configFiles = @(
    @{ name = '.gitignore'; path = '.gitignore' },
    @{ name = '.env.example'; path = '.env.example' },
    @{ name = 'crypto-api.js'; path = 'crypto-api.js' }
)

foreach ($config in $configFiles) {
    $exists = Test-Path $config.path
    $severity = if ($config.path -match 'gitignore|env') { 'medium' } else { 'high' }
    Test-Item -name $config.name -condition $exists -severity $severity
}

# Test 8: Analyse du contenu des fichiers critiques
Write-Host "`n📋 TEST 8: ANALYSE DU CONTENU" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

# Analyser index.html
if (Test-Path 'index.html') {
    $indexContent = Get-Content 'index.html' -Raw

    Test-Item -name 'Titre CryptoBoost dans HTML' -condition ($indexContent -match 'CryptoBoost') -severity 'high'
    Test-Item -name 'Meta viewport mobile' -condition (($indexContent -match 'viewport') -and ($indexContent -match 'width=device-width')) -severity 'high'
    Test-Item -name 'Feuille de style CSS' -condition ($indexContent -match 'styles.css') -severity 'high'
    Test-Item -name 'Script app.js' -condition ($indexContent -match 'app.js') -severity 'high'
    Test-Item -name 'Script auth.js' -condition ($indexContent -match 'auth.js') -severity 'high'
    Test-Item -name 'Modal de connexion' -condition ($indexContent -match 'loginModal') -severity 'high'
    Test-Item -name 'Modal d\'inscription' -condition ($indexContent -match 'registerModal') -severity 'high'
    Test-Item -name 'Section hero' -condition ($indexContent -match 'hero') -severity 'medium'
    Test-Item -name 'Section stats' -condition ($indexContent -match 'stats') -severity 'medium'
    Test-Item -name 'Section features' -condition ($indexContent -match 'features') -severity 'medium'
}

# Analyser styles.css
if (Test-Path 'styles.css') {
    $cssContent = Get-Content 'styles.css' -Raw

    Test-Item -name 'Variables CSS crypto' -condition ($cssContent -match '--crypto-primary') -severity 'medium'
    Test-Item -name 'Variables CSS gradients' -condition ($cssContent -match '--gradient-crypto') -severity 'medium'
    Test-Item -name 'Animations CSS' -condition (($cssContent -match '@keyframes') -or ($cssContent -match 'animation')) -severity 'medium'
    Test-Item -name 'Media queries responsive' -condition ($cssContent -match '@media') -severity 'medium'
    Test-Item -name 'Styles Tailwind' -condition (($cssContent -match 'bg-') -or ($cssContent -match 'text-') -or ($cssContent -match 'p-')) -severity 'medium'
}

# Analyser app.js
if (Test-Path 'app.js') {
    $appContent = Get-Content 'app.js' -Raw

    $criticalFunctions = @('showLogin', 'showRegister', 'showDashboard', 'showDeposit', 'showWithdraw', 'showExchange')
    foreach ($func in $criticalFunctions) {
        $hasFunction = ($appContent -match "function $func") -or ($appContent -match "$func =")
        Test-Item -name "Fonction $func dans app.js" -condition $hasFunction -severity 'high'
    }
}

# Analyser auth.js
if (Test-Path 'auth.js') {
    $authContent = Get-Content 'auth.js' -Raw

    $authFunctions = @('validateAuth', 'getCurrentUser', 'protectPage', 'logout')
    foreach ($func in $authFunctions) {
        $hasFunction = ($authContent -match "function $func") -or ($authContent -match "$func =")
        Test-Item -name "Fonction $func dans auth.js" -condition $hasFunction -severity 'high'
    }
}

# Test 9: Taille des fichiers
Write-Host "`n📏 TEST 9: TAILLE DES FICHIERS" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

$fileSizeChecks = @(
    @{ name = 'index.html'; path = 'index.html'; maxSize = 100000 }, # 100KB
    @{ name = 'styles.css'; path = 'styles.css'; maxSize = 500000 }, # 500KB
    @{ name = 'app.js'; path = 'app.js'; maxSize = 200000 }, # 200KB
    @{ name = 'admin.js'; path = 'admin.js'; maxSize = 150000 } # 150KB
)

foreach ($check in $fileSizeChecks) {
    if (Test-Path $check.path) {
        $fileInfo = Get-Item $check.path
        $sizeKB = [math]::Round($fileInfo.Length / 1024)
        $isValidSize = $fileInfo.Length -le $check.maxSize
        $severity = if ($fileInfo.Length -gt ($check.maxSize * 1.5)) { 'high' } else { 'medium' }
        Test-Item -name "Taille $($check.name) ($sizeKB KB)" -condition $isValidSize -severity $severity
    }
}

# Test 10: Scripts de test disponibles
Write-Host "`n🧪 TEST 10: SCRIPTS DE TEST DISPONIBLES" -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue

$availableTests = @(
    'test-complet-cryptoboost.js',
    'diagnostic-console.js',
    'final-error-check.js',
    'live-site-quick-test.js',
    'test-session-functionality.js',
    'quick-function-test.js'
)

foreach ($testFile in $availableTests) {
    $exists = Test-Path $testFile
    Test-Item -name "Script de test: $testFile" -condition $exists -severity 'medium'
}

# Rapport final
$score = [math]::Round(($success / $tests) * 100)

Write-Host "`n" + "=" * 80 -ForegroundColor Magenta
Write-Host "🎯 RAPPORT FINAL TEST LOCAL CRYPTOBOOST" -ForegroundColor Magenta
Write-Host "=" * 80 -ForegroundColor Magenta

Write-Host "`n📊 RÉSULTATS GÉNÉRAUX:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host "✅ Tests réussis: $success/$tests" -ForegroundColor Green
Write-Host "❌ Erreurs critiques: $errors" -ForegroundColor Red
Write-Host "⚠️ Avertissements: $warnings" -ForegroundColor Yellow
Write-Host "🎯 Score global: $score%" -ForegroundColor Magenta

Write-Host "`n📋 ÉVALUATION:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan

if ($score -ge 90) {
    Write-Host "🎉 EXCELLENT - Projet complet et fonctionnel !" -ForegroundColor Green
    Write-Host "   ✅ Tous les fichiers critiques présents" -ForegroundColor Green
    Write-Host "   ✅ Structure de projet optimale" -ForegroundColor Green
    Write-Host "   ✅ Scripts de test et correction disponibles" -ForegroundColor Green
} elseif ($score -ge 80) {
    Write-Host "👍 TRÈS BON - Quelques fichiers manquants" -ForegroundColor Yellow
    Write-Host "   ⚠️ Vérifier les fichiers manquants" -ForegroundColor Yellow
    Write-Host "   ✅ Base solide présente" -ForegroundColor Green
} elseif ($score -ge 70) {
    Write-Host "🟡 BON - Corrections recommandées" -ForegroundColor Yellow
    Write-Host "   ❌ Fichiers critiques manquants" -ForegroundColor Red
    Write-Host "   ✅ Structure de base présente" -ForegroundColor Green
} elseif ($score -ge 50) {
    Write-Host "🟠 MOYEN - Fichiers manquants" -ForegroundColor Red
    Write-Host "   ❌ Plusieurs fichiers critiques absents" -ForegroundColor Red
    Write-Host "   ⚠️ Reconstruction partielle nécessaire" -ForegroundColor Yellow
} else {
    Write-Host "❌ CRITIQUE - Projet incomplet" -ForegroundColor Red
    Write-Host "   🚨 Fichiers essentiels manquants" -ForegroundColor Red
    Write-Host "   ❌ Reconstruction majeure nécessaire" -ForegroundColor Red
}

Write-Host "`n🔧 RECOMMANDATIONS:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

if ($errors -gt 0) {
    Write-Host "🚨 Créer les fichiers critiques manquants" -ForegroundColor Red
}
if ($warnings -gt 5) {
    Write-Host "⚠️ Vérifier l'intégrité des fichiers existants" -ForegroundColor Yellow
}
if ($score -lt 80) {
    Write-Host "🔧 Utiliser les scripts de correction automatique" -ForegroundColor Magenta
}

Write-Host "`n📁 FICHIERS CRITIQUES MANQUANTS:" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Lister les fichiers manquants
$allFiles = @()
$allFiles += $criticalFiles
$allFiles += $htmlPages
$allFiles += $netlifyFunctions
$allFiles += $assets
$allFiles += $configFiles

$missingFiles = @()
foreach ($file in $allFiles) {
    if (!(Test-Path $file.path)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    foreach ($file in $missingFiles) {
        Write-Host "   • $($file.name) ($($file.path))" -ForegroundColor Red
    }
} else {
    Write-Host "   ✅ Aucun fichier manquant !" -ForegroundColor Green
}

Write-Host "`n📅 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "📁 Dossier analysé: $(Get-Location)" -ForegroundColor White
Write-Host "📅 Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "📊 Total fichiers: $tests" -ForegroundColor White
Write-Host "✅ Fichiers valides: $success" -ForegroundColor Green

Write-Host "`n" + "=" * 80 -ForegroundColor Magenta
Write-Host "🏁 TEST LOCAL TERMINÉ" -ForegroundColor Magenta
Write-Host "=" * 80 -ForegroundColor Magenta

if ($score -lt 100) {
    Write-Host "`n💡 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "1. 📁 Créer les fichiers manquants" -ForegroundColor White
    Write-Host "2. 🔍 Vérifier l'intégrité des fichiers existants" -ForegroundColor White
    Write-Host "3. 🧪 Lancer les tests sur le site live" -ForegroundColor White
    Write-Host "4. 🔧 Appliquer les corrections automatiques" -ForegroundColor White
    Write-Host "5. 🚀 Pousser les corrections sur GitHub" -ForegroundColor White
}

Write-Host "`n🎯 Pour tester sur le site live:" -ForegroundColor Green
Write-Host "   🌐 https://cryptoboost.world" -ForegroundColor Green
Write-Host "   📋 Utilisez test-complet-cryptoboost.js dans la console" -ForegroundColor Green

Write-Host "`n" -NoNewline
