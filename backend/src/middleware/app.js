/**
 * Serveur Express - API Packages
 */

import express from "express";
import apiPackages from "./api_packages.js";
import apiDestinations from "./api_destinations.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(apiPackages);
app.use(apiDestinations);

app.get('/', (req, res) => {
  res.json({
    message: 'API Packages',
    endpoints: {
      'GET /packages/:id': 'Récupérer un package',
      'POST /packages': 'Créer un package',
      'PUT /packages/:id': 'Modifier un package',
      'DELETE /packages/:id': 'Supprimer un package',
      'GET /destinations/:id': 'Récupérer une destination',
      'POST /destinations': 'Créer une destination',
      'PUT /destinations/:id': 'Modifier une destination',
      'DELETE /destinations/:id': 'Supprimer une destination'
    }
  });
});

app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});
