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


4. Contributors

------------------------------
Zidane R. Mansouri :

Component   - Inscription
Page        - Register
Destination - Back end
Destination - Api
Doc         - ReadMe
Support     - Test Postman

------------------------------
Ara Ghahramanyan :

Component   - Footer 
Component   - Barre navigation
Component   - Section offres
Component   - Carte offre
Page        - Accueuil
Back end    - Packages
API         - Packages

------------------------------
Charbel Barrak :

Component - Login
Page      - Page Login
Back end  - Users
API       - Users
Install   - logger
Install   - Env. Scripts


------------------------------

Tristan Tanguay

Component - Barre Recherche
Component - Carte Offre Promo
Component - Carte Reservation
Page      - Reservation Page
Back end  - Reservations
API       - Reservations
Doc       - Cas d'utilisation

------------------------------
