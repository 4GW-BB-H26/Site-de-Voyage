/**
 * Configuration Express de l'API
 */

import express from "express";
import apiPackages from "./api_packages.js";
import apiDestinations from "./api_destinations.js";
import apiUsers from "./api_users.js";
import apiReservations from "./api_reservations.js";

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

app.use(apiPackages);
app.use(apiDestinations);
app.use(apiUsers);
app.use(apiReservations);

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
      "GET /reservations/user/:userId": "Lister les reservations d'un utilisateur",
      "GET /reservations/:id": "Recuperer une reservation",
      "POST /reservations": "Creer une reservation",
      "DELETE /reservations/:id": "Supprimer une reservation"
    },
    health: "/health"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

export default app;
