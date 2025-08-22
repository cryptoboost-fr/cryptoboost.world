Write-Host "=== Déploiement sécurisé de CryptoBoost ===" -ForegroundColor Green

try {
    # 1. Supprimer tous les scripts contenant des tokens
    Write-Host "Nettoyage des fichiers sensibles..." -ForegroundColor Yellow
    Remove-Item -Path "deploy-to-github.ps1" -ErrorAction SilentlyContinue
    Remove-Item -Path "install-git.ps1" -ErrorAction SilentlyContinue
    Remove-Item -Path "secure-deploy.ps1" -ErrorAction SilentlyContinue
    
    # 2. Supprimer l'historique Git existant
    Write-Host "Nettoyage de l'historique Git..." -ForegroundColor Yellow
    Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue
    
    # 3. Initialiser un nouveau dépôt
    Write-Host "Initialisation d'un nouveau dépôt Git..." -ForegroundColor Yellow
    git init
    
    # 4. Configuration de Git
    Write-Host "Configuration de Git..." -ForegroundColor Yellow
    git config user.name "CryptoBoost"
    git config user.email "contact@cryptoboost.world"
    
    # 5. Ajouter tous les fichiers sauf .env
    Write-Host "Ajout des fichiers au dépôt..." -ForegroundColor Yellow
    git add .
    
    # 6. Créer le commit initial
    Write-Host "Création du commit initial..." -ForegroundColor Yellow
    git commit -m "Initial commit: CryptoBoost MVP (Security compliant version)"
    
    # 7. Configuration de la branche main
    Write-Host "Configuration de la branche main..." -ForegroundColor Yellow
    git branch -M main
    
    # 8. Configuration du remote avec le token en variable d'environnement
    Write-Host "Push vers GitHub..." -ForegroundColor Yellow
    $repoUrl = "https://$($env:GITHUB_TOKEN)@github.com/cryptoboost-fr/cryptoboost.world.git"
    git remote add origin $repoUrl
    git push -u origin main --force
    
    Write-Host "=== Déploiement terminé avec succès! ===" -ForegroundColor Green
    
} catch {
    Write-Host "Une erreur est survenue:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
