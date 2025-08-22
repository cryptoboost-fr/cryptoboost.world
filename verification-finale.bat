@echo off
chcp 65001 >nul
echo ========================================
echo VERIFICATION FINALE CRYPTOBOOST
echo ========================================
echo.

echo VERIFICATION DU TITRE CRYPTOBOOST:
echo ==================================
findstr "CryptoBoost" index.html
if %errorlevel% == 0 (
    echo ✅ TITRE CRYPTOBOOST TROUVE !
) else (
    echo ❌ TITRE NON TROUVE
)

echo.
echo VERIFICATION DES VARIABLES CSS:
echo ===============================
findstr "--crypto-primary" styles.css
if %errorlevel% == 0 (
    echo ✅ VARIABLE --crypto-primary TROUVEE !
) else (
    echo ❌ VARIABLE NON TROUVEE
)

echo.
echo CONTENU DES VARIABLES CSS CRYPTO:
echo ================================
findstr "crypto-" styles.css

echo.
echo ========================================
echo RESULTAT FINAL:
echo ========================================

set /a titre_ok=0
set /a css_ok=0

findstr "CryptoBoost" index.html >nul
if %errorlevel% == 0 set /a titre_ok=1

findstr "--crypto-primary" styles.css >nul
if %errorlevel% == 0 set /a css_ok=1

if %titre_ok%==1 if %css_ok%==1 (
    echo 🎉 PARFAIT ! AUCUNE ERREUR !
    echo Score: 100%% - Projet complet
) else (
    echo ⚠️ Quelques corrections mineures
    if %titre_ok%==0 echo   - Titre CryptoBoost a corriger
    if %css_ok%==0 echo   - Variable CSS a corriger
)

echo.
echo ========================================
echo PROCHAIN TEST SUR LE SITE LIVE:
echo 🌐 https://cryptoboost.world
echo 📋 Utilisez test-complet-cryptoboost.js
echo ========================================

pause
