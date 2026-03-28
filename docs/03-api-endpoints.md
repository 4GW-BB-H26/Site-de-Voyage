# Documentation API Express

L’API est décrite à la racine `GET /` (liste des endpoints) et dans `backend/src/app.js`.

Principales ressources :

| Méthode | Chemin | Description |
|--------|--------|-------------|
| GET | `/health` | Santé du service |
| GET | `/user` | Connexion (query `email`, `password`) |
| POST | `/users` | Création d’utilisateur |
| GET | `/reservations/user/:userId` | Réservations d’un utilisateur |
| … | … | Voir réponse JSON de `GET /` |

Base URL locale par défaut : `http://localhost:3000`.
