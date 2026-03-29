/**
 * Application Express — enregistrement des routes et middlewares
 */

import express from "express";
import packagesRoutes from "./routes/packages.routes.js";
import destinationsRoutes from "./routes/destinations.routes.js";
import usersRoutes from "./routes/users.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import accueilRoutes from "./routes/accueil.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
import favoriteRoutes from "./routes/favorites.routes.js";
import commentRoutes from "./routes/comments.routes.js";

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
