Ce fichier sert comme documentation de comment "launch" notre site web

1.0: Configurer les bases de données:
Cette partie sert à montrer comment configurer les bases de données Oracle et mongodb

1.1: Oracle:
Pour créer la connection à la base de données Oracle vous aurez besoin de vous connecter en tant que sys (SYSDBA) sur le port 1521.
Elements de connexion:

- Connection name: sys@freepdb1
- Username: sys
- Password: oracle
- Role: SYSDBA
- Hostname: localhost
- Port 1521
- Service Name: freepdb1

Ensuite vous devez run le script Creation_User.sql, situer dans le repertoire backend/scripts, en tant que sys.
Ce script creera la connexion utilisee pour le site web. Elle s'appelle: ProjetVoyag

Finalement connecter vous y!
Elements de connexion:

- Connection name: ProjetVoyage@freepdb1
- Username: ProjetVoyage
- Password: cisco
- Role: Default
- Hostname: localhost
- Port 1521
- Service Name: FREEPDB1

Pour conclure, run le script CreateEnv.sql, situer aussi dans le repertoire backend/scripts, en tant que ProjetVoyage
Ce script set a installer le logger, initialiser les tables ainsi que peupler ces tables.

---

1.2: Mongo Setup:
Le setup du mongo nécessite d'avoir déjà Docker installé sur votre machine.

- Création container :
  docker run -d --name mongo-db -p 27017:27017 mongo:7

- Si existe dejà :
  docker start mongo-db

- En cas d'erreur, vérifier l'installation des dépendances en executant (dans /backend/src) :
  npm install mongodb
  npm install mongoose
  npm install dotenv

- Pour tester la manipulation de donnée mongo, executer la commande suivante (toujours dans /backend/src):

  node tester_mongo.js

  Ce script génerera 2 favoris du users zidane_01 avec des ID provenants de Mongo tout en affichant un commentaire de l'uzbekistan. Confirmant que la MongoDB est connectée et fonctionelle.

---

2.0 Configurer le Backend:
Pour deployer le backend vous devez avoir configuré le Oracle ainsi que le Mongodb et avoir installer Node.js

2.1 Le deploiement:
La facon dont le backend est deployer depend de l'environnement que vous utiliser si vous etes sur:

- Linux (Les commandes a executer):
  cd backend
  chmod +x ./scripts/deploy-backend.sh || on s'assure de pouvoir executer le script avec le chmod +x
  ./scripts/deploy-backend.sh

- Windows (Les commandes a executer sur Powershell):
  powershell -ExecutionPolicy Bypass -File .\scripts\deploy-backend.ps1

---

3.0 Lancer le backend et ouvrir le site:
Tout devraient etre fonctionelle, vous pouvez maintenant acceder au site web:

3.1 Demarrer l'API:
Vous avez besoin de bien evidement demarer les 2 bases de donnees

Commandes:
cd backend
npm run dev (ou npm start)

3.2 Demarrer le Site Web:

Commandes:
cd frontend
npm run dev (ou npm start)
