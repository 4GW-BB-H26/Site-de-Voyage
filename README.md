# Travel Express

Projet du cours d’applications transactionnelles. C’est un site de voyage avec une page web en **React** et une **API** en **Node** (Express). Les données principales sont dans **Oracle**. Les favoris et les commentaires sont dans **MongoDB**.

## Ce qu’il faut avoir sur la machine

- **Node.js** (pour lancer `npm`)
- **Oracle** (base du cours, avec un utilisateur et un mot de passe que vous mettez dans la config)
- **MongoDB** installé et démarré (pour favoris et commentaires, et pour l’option de connexion sur Mongo si vous l’utilisez)

## Dossiers du projet

- **`frontend`** — l’interface React (Vite). Pages, composants, appels à l’API dans `src/`.
- **`backend`** — l’API Express. Routes, contrôleurs, validation, connexion Oracle et Mongo dans `src/`.
- **`docs`** — textes du cours (analyse, personas, API, schéma).

## Avant la première exécution

### Fichier de configuration du backend

1. Dans le dossier `backend`, dupliquez le fichier **`.env.example`** et renommez la copie en **`.env`**.
2. Ouvrez **`.env`** avec un éditeur de texte et remplissez au moins :
   - identifiants **Oracle** (`ORACLE_USER`, `ORACLE_PASSWORD`, `ORACLE_CONNECT_STRING`)
   - **JWT** (`JWT_SECRET`, etc., comme dans l’exemple)
   - **Mongo** (`MONGODB_URI`, `MONGODB_DB_NAME`)
   - **`AUTH_MODE`** : mettez `oracle` si les comptes sont dans Oracle, ou `mongo` si vous testez sans Oracle (dans ce cas Mongo doit être démarré avant l’API).

Toutes les variables possibles sont commentées dans **`backend/.env.example`**.

### Fichier optionnel du frontend

Si l’API n’est pas sur `http://localhost:3000`, créez **`frontend/.env`** avec une ligne du type :

`VITE_API_URL=http://localhost:3000`

(en changeant l’adresse si besoin). Sans ce fichier, le frontend utilise déjà `http://localhost:3000` par défaut.

## Lancer le projet

Ouvrez **deux** fenêtres de terminal (une pour l’API, une pour le site).

**Terminal 1 — API**

```
cd backend
npm install
npm run dev
```

**Terminal 2 — site web**

```
cd frontend
npm install
npm run dev
```

Quand c’est démarré, le terminal affiche l’adresse du site (souvent `http://localhost:5173` pour Vite). L’API écoute en général sur le port **3000** (voir `PORT` dans `backend/.env`).

Pour vérifier que l’API répond, vous pouvez ouvrir dans le navigateur **`http://localhost:3000`** ou **`http://localhost:3000/health`** selon ce que le projet expose.

## MongoDB

Mongo doit être **installé et lancé** avant le backend si vous utilisez favoris, commentaires ou `AUTH_MODE=mongo`. L’URI par défaut dans l’exemple est du type `mongodb://localhost:27017`. Adaptez-la dans **`.env`** si votre installation est différente.

## Validation

- Sur le **frontend**, les formulaires importants passent par le paquet **validator** (fichier `frontend/src/utils/validator.js`).
- Sur le **backend**, les requêtes sont vérées avec **express-validator** (fichier `backend/src/validators/index.js` et petits helpers dans `backend/src/utils/validator.js`).

## Autres commandes utiles (facultatif)

Dans **`backend`** après `npm install` :

- `npm start` — lance l’API sans rechargement automatique du fichier.

Dans **`frontend`** après `npm install` :

- `npm run build` — prépare une version pour la mise en production.
- `npm run lint` — vérifie le style du code avec ESLint.

## Documentation

Les fichiers du dossier **`docs/`** complètent ce README (analyse, personas, liste d’endpoints, schéma de base).

## Équipe

Projet réalisé dans le cadre du cours d’applications transactionnelles (équipe 1).
