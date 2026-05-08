# Travel Express

Ce projet est un site de voyage.

- La partie visuelle est dans `frontend` (React).
- La partie serveur est dans `backend` (Node + Express).
- Les données principales sont dans Oracle.
- Les favoris et commentaires sont dans MongoDB.

Ce guide est fait pour une personne qui débute. Suivez les étapes dans l'ordre.

## 1) Ce qu'il faut installer avant de commencer

Sur votre ordinateur, installez:

1. **Node.js** (version LTS recommandée)
2. **Oracle** (avec un utilisateur et mot de passe valides)
3. **MongoDB** (installé et démarré)

Ensuite, ouvrez un terminal dans le dossier du projet et vérifiez:

```bash
node -v
npm -v
```

Si les 2 commandes affichent une version, c'est bon.

## 2) Structure du projet

- `frontend`: le site web (pages React)
- `backend`: l'API (routes, logique, connexion BD)
- `docs`: documents de cours

## 3) Configuration backend (obligatoire)

1. Allez dans le dossier `backend`.
2. Copiez le fichier `.env.example`.
3. Renommez la copie en `.env`.
4. Ouvrez le fichier `.env` et remplissez les valeurs:
   - `ORACLE_USER`
   - `ORACLE_PASSWORD`
   - `ORACLE_CONNECT_STRING`
   - `JWT_SECRET`
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
   - `AUTH_MODE` (`oracle` ou `mongo`)

Notes:

- Si `AUTH_MODE=oracle`, la connexion utilisateur passe par Oracle.
- Si `AUTH_MODE=mongo`, MongoDB doit être actif avant de lancer l'API.

## 4) Configuration frontend (optionnelle)

Par défaut, le frontend appelle `http://localhost:3000`.

Si votre backend tourne sur une autre adresse, créez `frontend/.env` avec:

```env
VITE_API_URL=http://localhost:3000
```

Remplacez l'adresse si besoin.

## 5) Démarrage du projet complet

Il faut ouvrir **2 terminaux**.

### Terminal A (backend)

```bash
cd backend
npm install
npm run dev
```

### Terminal B (frontend)

```bash
cd frontend
npm install
npm run dev
```

## 6) Vérifier que tout marche

### Vérification backend

Dans votre navigateur:

- `http://localhost:3000`
- `http://localhost:3000/health`

Si vous voyez une réponse JSON, l'API marche.

### Vérification frontend

Le terminal frontend affiche une URL (souvent `http://localhost:5173`).
Ouvrez cette URL dans le navigateur.

Vous devez pouvoir:

- ouvrir la page d'accueil
- ouvrir l'inscription
- ouvrir la connexion
- aller sur réservations et favoris (si connecté)

## 7) Vérifier les fonctions demandées (check simple)

Voici une vérification simple, étape par étape:

1. **Créer un compte**
   - Aller sur inscription
   - Remplir le formulaire
   - Vérifier qu'un message de succès apparaît

2. **Se connecter**
   - Aller sur login
   - Entrer email + mot de passe
   - Vérifier que la connexion fonctionne

3. **Tester les réservations**
   - Aller sur la page réservations
   - Vérifier que les données se chargent

4. **Tester les favoris**
   - Aller sur la page favoris
   - Vérifier que la liste s'affiche

5. **Tester les infos pays (API externe)**
   - Sur les cartes qui montrent un pays, vérifier que les infos pays se chargent

6. **Tester la validation**
   - Essayer un formulaire vide ou avec email invalide
   - Vérifier qu'un message d'erreur clair apparaît

7. **Tester les erreurs serveur**
   - Arrêter le backend
   - Recharger une page qui demande des données
   - Vérifier qu'un message d'erreur apparaît côté site

## 8) Vérifier le code rapidement

### Backend

Dans `backend`:

```bash
npm run test:oracle
```

Ce test vérifie la connexion Oracle.

### Frontend

Dans `frontend`:

```bash
npm run lint
npm run build
```

- `lint` vérifie le style du code
- `build` vérifie que le site peut être préparé pour la production

## 9) Arrêter le projet

Dans chaque terminal (`backend` et `frontend`), faites `Ctrl + C`.

## 10) Problèmes fréquents

- **Le backend ne démarre pas**
  - Vérifiez `backend/.env`
  - Vérifiez Oracle/MongoDB démarrés
  - Vérifiez que le port 3000 n'est pas déjà pris

- **Le frontend ne charge rien**
  - Vérifiez que le backend tourne
  - Vérifiez `VITE_API_URL` si vous avez changé le port

- **Erreur de connexion utilisateur**
  - Vérifiez `AUTH_MODE`
  - Vérifiez vos identifiants de base de données

## 11) Informations utiles

- README backend détaillé: `backend/README.md`
- Endpoints API: `docs/03-api-endpoints.md`
- Schéma de base: `docs/04-database-schema.md`

## Équipe

Projet réalisé dans le cadre du cours d'applications transactionnelles (équipe 1).
