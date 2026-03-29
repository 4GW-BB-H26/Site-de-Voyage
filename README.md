# Travel Express

Application transactionnelle de réservation de voyages : interface **React (Vite)** et API **Express** avec base **Oracle**.

## Structure du dépôt

```
Equipe-1-TP/
├── frontend/          # Application React (Vite)
├── backend/           # API Express + Oracle
├── docs/              # Documentation du projet
├── .gitignore
└── README.md
```

### Frontend (`frontend/`)

- `index.html` — point d’entrée Vite (à la racine du dossier `frontend/`, convention Vite).
- `public/` — fichiers statiques servis tels quels.
- `src/api/` — appels HTTP (fetch) vers l’API.
- `src/components/` — composants réutilisables.
- `src/pages/` — pages écran.
- `src/hooks/`, `src/context/`, `src/utils/` — à compléter selon les besoins.
- `src/styles/` — feuilles de style.

Variables d’environnement : créer `frontend/.env` avec par exemple `VITE_API_URL=http://localhost:3000`.

### Backend (`backend/`)

- `src/server.js` — démarrage HTTP.
- `src/app.js` — configuration Express et montage des routes.
- `src/config/` — configuration (Oracle, variables d’environnement).
- `src/controllers/` — logique des requêtes HTTP.
- `src/routes/` — définition des routes Express.
- `src/middleware/` — middlewares Express (erreurs, etc.).
- `src/utils/` — utilitaires applicatifs (ex. journalisation console).

Copier `backend/.env.example` vers `backend/.env` et ajuster les identifiants Oracle.

## Démarrage

**API** (depuis `backend/`) :

```bash
npm install
npm run dev
```

**Frontend** (depuis `frontend/`) :

```bash
npm install
npm run dev
```

## Documentation

Voir le dossier `docs/` : `01-analyse préliminaire.md`, `02-personas.md`, `03-api-endpoints.md`, `04-database-schema.md`.

Mongo DB

Création container :
docker run -d --name mongo-db -p 27017:27017 mongo:7

Si existe dejà :
docker start mongo-db

Playground Test :

use('voyage_db');

//insertion fav
db.favoris.insertOne({
    userId: "user123",
    destinationId: "paris01",
    nomDestination: "Paris",
    dateAjout: new Date()
});

//insrtion comment
db.commentaires.insertOne({
    destinationId: "paris01",
    auteur: "Rakane",
    texte: "Pire voyage de ma vie, mais merite quand meme un 5",
    note: 5
});
