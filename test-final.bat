@echo off
echo 🚀 TEST FINAL CRYPTOBOOST
echo ===============================
echo Date: %DATE% Time: %TIME%
echo.

set /a tests=0
set /a success=0
set /a errors=0
set /a warnings=0

echo STRUCTURE DU PROJET:
echo ====================

if exist "index.html" (
    echo ✅ index.html present
    set /a success+=1
) else (
    echo ❌ index.html missing
    set /a errors+=1
)
set /a tests+=1

if exist "styles.css" (
    echo ✅ styles.css present
    set /a success+=1
) else (
    echo ❌ styles.css missing
    set /a errors+=1
)
set /a tests+=1

if exist "app.js" (
    echo ✅ app.js present
    set /a success+=1
) else (
    echo ❌ app.js missing
    set /a errors+=1
)
set /a tests+=1

echo.
echo PAGES HTML (20 pages):
echo =====================

set /a html_count=0
for %%f in (about.html contact.html cgu.html cookies.html privacy.html client-dashboard.html client-investments.html client-transactions.html client-wallets.html client-notifications.html client-profile.html client-support.html admin.html admin-users.html admin-transactions.html admin-investments.html admin-wallets.html admin-reports.html admin-settings.html) do (
    if exist "%%f" (
        set /a html_count+=1
        set /a success+=1
    ) else (
        echo ❌ %%f missing
        set /a errors+=1
    )
    set /a tests+=1
)

echo ✅ %html_count% pages HTML presentes

echo.
echo FONCTIONS NETLIFY:
echo =================

set /a netlify_count=0
for %%f in (functions/github-db.js functions/coinapi.js functions/github-db-enhanced.js functions/coinapi-enhanced.js) do (
    if exist "%%f" (
        set /a netlify_count+=1
        set /a success+=1
    ) else (
        echo ❌ %%f missing
        set /a errors+=1
    )
    set /a tests+=1
)

echo ✅ %netlify_count% fonctions Netlify presentes

echo.
echo ASSETS:
echo =======

set /a assets_count=0
for %%f in (assets/logo.svg assets/hero-chart.svg assets/favicon.svg assets/enhanced-animations.css assets/enhanced-interactions.js) do (
    if exist "%%f" (
        set /a assets_count+=1
        set /a success+=1
    ) else (
        echo ❌ %%f missing
        set /a warnings+=1
    )
    set /a tests+=1
)

echo ✅ %assets_count% assets presents

echo.
echo SCRIPTS DE TEST:
echo ===============

set /a test_count=0
for %%f in (test-complet-cryptoboost.js diagnostic-console.js final-error-check.js live-site-quick-test.js) do (
    if exist "%%f" (
        set /a test_count+=1
        set /a success+=1
    ) else (
        echo ❌ %%f missing
        set /a warnings+=1
    )
    set /a tests+=1
)

echo ✅ %test_count% scripts de test presents

echo.
echo VERIFICATIONS CONTENU:
echo =====================

echo Verification titre CryptoBoost...
findstr "CryptoBoost" index.html >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Titre CryptoBoost trouve
    set /a success+=1
) else (
    echo ❌ Titre CryptoBoost non trouve
    set /a errors+=1
)
set /a tests+=1

echo Verification variables CSS crypto...
findstr "--crypto-primary" styles.css >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Variables CSS crypto trouvees
    set /a success+=1
) else (
    echo ❌ Variables CSS crypto non trouvees
    set /a warnings+=1
)
set /a tests+=1

echo.
echo ===============================
echo RAPPORT FINAL:
echo ===============================
echo Tests totals: %tests%
echo Tests reussis: %success%
echo Erreurs: %errors%
echo Avertissements: %warnings%

set /a score=success*100/tests
echo Score: %score%%%

if %score% GEQ 95 (
    echo ✅ PARFAIT - Aucun probleme detecte!
) else if %score% GEQ 80 (
    echo ✅ TRES BON - Quelques problemes mineurs
) else (
    echo ❌ Corrections necessaires
)

echo.
echo ===============================
echo PROCHAINES ETAPES:
echo ===============================
echo 🌐 Testez sur https://cryptoboost.world
echo 📋 Utilisez test-complet-cryptoboost.js dans la console

pause
