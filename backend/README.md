# Backend Travel Express

Ce dossier contient l'API Express du projet.

## 1) Prérequis

- Node.js installé
- Oracle accessible (si `AUTH_MODE=oracle`)
- MongoDB lancé (favoris, commentaires, ou `AUTH_MODE=mongo`)

## 2) Déploiement rapide

### Windows PowerShell

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-backend.ps1
```

### Linux / macOS

```bash
cd backend
chmod +x ./scripts/deploy-backend.sh
./scripts/deploy-backend.sh
```

Les scripts font 2 choses:
- créent `.env` à partir de `.env.example` si le fichier manque
- installent les dépendances npm

## 3) Configuration `.env`

Variables importantes:

- `PORT` (souvent 3000)
- `AUTH_MODE` (`oracle` ou `mongo`)
- `JWT_SECRET`
- `ORACLE_USER`
- `ORACLE_PASSWORD`
- `ORACLE_CONNECT_STRING`
- `MONGODB_URI`
- `MONGODB_DB_NAME`

## 4) Démarrer l'API

```bash
npm run dev
```

API locale par défaut:
- `http://localhost:3000`
- santé: `http://localhost:3000/health`

## 5) Vérifier Oracle (optionnel)

Script de test Oracle:

```bash
npm run test:oracle
```

## 6) Notes utiles

- L'API gère les erreurs de façon centralisée.
- Les mots de passe sont encodés avec `bcryptjs`.
- Les routes Mongo utilisent les collections `favoris` et `commentaires`.
- Des index Mongo sont créés au démarrage pour de meilleures perfs.
