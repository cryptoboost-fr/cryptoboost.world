@echo off
chcp 65001 >nul
echo 🚀 TEST RAPIDE CRYPTOBOOST
echo ===============================
echo ⏰ %DATE% %TIME%
echo 📁 %CD%
echo.

set /a tests=0
set /a success=0
set /a errors=0
set /a warnings=0

echo 📁 TEST 1: STRUCTURE DU PROJET
echo ==============================

call :test_file "index.html" high
call :test_file "styles.css" high
call :test_file "app.js" high
call :test_file "auth.js" high
call :test_file "admin.js" high
call :test_file "netlify.toml" high

echo.
echo 📄 TEST 2: PAGES HTML
echo ===================

call :test_file "about.html" high
call :test_file "contact.html" high
call :test_file "cgu.html" medium
call :test_file "cookies.html" medium
call :test_file "privacy.html" medium
call :test_file "client-dashboard.html" medium
call :test_file "client-investments.html" medium
call :test_file "client-transactions.html" medium
call :test_file "client-wallets.html" medium
call :test_file "client-notifications.html" medium
call :test_file "client-profile.html" medium
call :test_file "client-support.html" medium
call :test_file "admin.html" high
call :test_file "admin-users.html" medium
call :test_file "admin-transactions.html" medium
call :test_file "admin-investments.html" medium
call :test_file "admin-wallets.html" medium
call :test_file "admin-reports.html" medium
call :test_file "admin-settings.html" medium

echo.
echo 🔗 TEST 3: FONCTIONS NETLIFY
echo ===========================

call :test_file "functions/github-db.js" high
call :test_file "functions/coinapi.js" high
call :test_file "functions/github-db-enhanced.js" high
call :test_file "functions/coinapi-enhanced.js" high

echo.
echo 🖼️ TEST 4: ASSETS
echo ===============

call :test_file "assets/logo.svg" high
call :test_file "assets/hero-chart.svg" medium
call :test_file "assets/favicon.svg" medium
call :test_file "assets/enhanced-animations.css" medium
call :test_file "assets/enhanced-interactions.js" medium

echo.
echo 🧪 TEST 5: SCRIPTS DE TEST
echo ========================

call :test_file "test-complet-cryptoboost.js" medium
call :test_file "diagnostic-console.js" medium
call :test_file "final-error-check.js" medium
call :test_file "live-site-quick-test.js" medium

echo.
echo 🔧 TEST 6: SCRIPTS DE CORRECTION
echo ===============================

call :test_file "fix-assets-loading.js" medium
call :test_file "fix-js-errors.js" medium
call :test_file "fix-404-pages.js" medium
call :test_file "final-bug-fixes-complete.js" medium

echo.
echo 📋 ANALYSE DU CONTENU
echo =====================

if exist "index.html" (
    echo Analyser index.html...
    findstr /I "CryptoBoost" index.html >nul
    if !errorlevel! == 0 (
        echo ✅ Titre CryptoBoost dans HTML
        set /a success+=1
    ) else (
        echo ❌ Titre CryptoBoost dans HTML
        set /a errors+=1
    )
    set /a tests+=1
)

if exist "styles.css" (
    echo Analyser styles.css...
    findstr /I "--crypto-primary" styles.css >nul
    if !errorlevel! == 0 (
        echo ✅ Variables CSS crypto
        set /a success+=1
    ) else (
        echo ❌ Variables CSS crypto
        set /a warnings+=1
    )
    set /a tests+=1
)

echo.
echo 📊 RAPPORT FINAL
echo ===============

set /a score=success*100/tests

echo Tests réussis: %success%/%tests%
echo Erreurs critiques: %errors%
echo Avertissements: %warnings%
echo Score global: %score%%%

if %score% GEQ 90 (
    echo 🎉 EXCELLENT - Projet complet !
) else if %score% GEQ 80 (
    echo 👍 TRES BON - Quelques manques
) else if %score% GEQ 70 (
    echo 🟡 BON - Corrections recommandees
) else (
    echo ❌ CRITIQUE - Fichiers manquants
)

echo.
echo 🎯 Pour tester sur le site live:
echo    🌐 https://cryptoboost.world
echo    📋 Utilisez test-complet-cryptoboost.js dans la console

goto :eof

:test_file
set /a tests+=1
if exist "%~1" (
    echo ✅ Fichier %~1
    set /a success+=1
) else (
    if "%~2"=="high" (
        echo ❌ Fichier %~1
        set /a errors+=1
    ) else (
        echo ⚠️ Fichier %~1
        set /a warnings+=1
    )
)
goto :eof
