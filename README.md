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

- En cas d'erreur, vérifier l'installation des dépendances en executant (dans le backend) :
  npm install mongodb
  npm install mongoose
  npm install dotenv

- Pour tester la manipulation de donnée mongo, executer la commande suivante (toujours dans backend):

  node tester_mongo.js

  Ce script génerera 2 favoris du users zidane_01 avec des ID provenants de Mongo tout en affichant un commentaire de l'uzbekistan. Confirmant que la MongoDB est connectée et fonctionelle.
