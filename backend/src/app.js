/**
 * Application Express — enregistrement des routes et middlewares
 */

import express from "express";
import packagesRoutes from "./routes/packages_routes.js";
import destinationsRoutes from "./routes/destinations_routes.js";
import usersRoutes from "./routes/users_routes.js";
import reservationsRoutes from "./routes/reservations_routes.js";
import accueilRoutes from "./routes/accueil_routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error_middleware.js";
import favoriteRoutes from "./routes/favorites_routes.js";
import commentRoutes from "./routes/comments_routes.js";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(accueilRoutes);
app.use(packagesRoutes);
app.use(destinationsRoutes);
app.use(usersRoutes);
app.use(reservationsRoutes);
app.use(favoriteRoutes);
app.use(commentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API backend en ligne",
    endpoints: {
      "GET /packages/:id": "Recuperer un package",
      "POST /packages": "Creer un package",
      "PUT /packages/:id": "Modifier un package",
      "DELETE /packages/:id": "Supprimer un package",
      "GET /destinations/:id": "Recuperer une destination",
      "POST /destinations": "Creer une destination",
      "PUT /destinations/:id": "Modifier une destination",
      "DELETE /destinations/:id": "Supprimer une destination",
      "GET /user": "Recuperer un utilisateur",
      "POST /users": "Creer un utilisateur",
      "PUT /users/:id": "Modifier un utilisateur",
      "DELETE /users/:id": "Supprimer un utilisateur",
      "GET /accueil": "Donnees page d'accueil (offres promotionnelles)",
      "GET /reservations/user/:userId": "Lister les reservations d'un utilisateur",
      "GET /reservations/:id": "Recuperer une reservation",
      "POST /reservations": "Creer une reservation",
      "DELETE /reservations/:id": "Supprimer une reservation",
      "PUT /reservation/ :id/cancel": "Annuler une reservation",
      mongoFavoris: {
        "POST /favorites": "Creer",
        "GET /favorites/user/:userId": "Lister par utilisateur",
        "GET /favorites/:id": "Lire un document",
        "PUT /favorites/:id": "Modifier",
        "DELETE /favorites/:id": "Supprimer",
      },
      mongoCommentaires: {
        "POST /comments": "Creer",
        "GET /comments/destination/:destId": "Lister par destination",
        "GET /comments/:id": "Lire un document",
        "PUT /comments/:id": "Modifier",
        "DELETE /comments/:id": "Supprimer",
      },
    },
    health: "/health",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
