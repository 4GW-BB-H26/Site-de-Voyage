# Equipe-1-TP

1. Configuration BD Oracle :

Créer connections:

sys@freepdb1
username : sys
Role : SYSDBA
pass : oracle
port : 1521
servicename : freepdb1

Run "Creation_User.sql" avec sys

ProjetVoyage@freepdb1
username : ProjetVoyage
Role : Default
pass : cisco
port : 1521
servicename : freepdb1

Run "CreateEnv.sql" avec ProjetVoyage

Compiler touts les fichiers .pks et .pkb présent dans .\backend\src\config

2. Terminal et test Backend

Naviguez dans le dossier backend
Terminal -> New Terminal

cd backend
npm install express oracledb
node src/middleware/app.js

3. Frontend Generation

Naviguez dans le dossier frontend
Terminal -> New Terminal

cd frontend/src
npm install
npm run dev
