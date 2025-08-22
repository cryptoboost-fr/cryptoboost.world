@echo off
echo Installation de Node.js et initialisation du projet...

REM Téléchargement de Node.js
curl -o node-setup.msi https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi

REM Installation de Node.js
msiexec /i node-setup.msi /qn

REM Attendre que l'installation soit terminée
timeout /t 30

REM Supprimer le fichier d'installation
del node-setup.msi

REM Installation des dépendances
npm install

REM Installation des packages nécessaires
npm install express cors dotenv axios netlify-cli -g

echo Installation terminée !

REM Démarrage du serveur de développement
netlify dev
