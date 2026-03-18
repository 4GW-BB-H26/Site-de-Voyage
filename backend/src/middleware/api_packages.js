// Import des modules nécessaires (framework HTTP, driver Oracle, config DB et logger)
import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";
import logger from "./logger.js";

// Création du routeur Express pour regrouper les routes liées aux packages
const router = express.Router();
// Définition du type de paramètre de sortie Oracle pour recevoir une grande chaîne JSON
const OUT_STRING = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40000 };

// Route GET : récupère un package à partir de son identifiant
// Appelle la procédure Oracle package_tapi.get_package et retourne le JSON reçu
router.get("/packages/:id", async (req, res) => {
  // Récupération et conversion du paramètre d'URL en nombre entier
  const id = parseInt(req.params.id, 10);
  // Validation de base : l'ID doit être présent et numérique
  if (!id || isNaN(id)) {
    return res.status(400).json({
      errors: [{
        status: "400",
        title: "Paramètre manquant",
        detail: "Le paramètre p_id_package est requis.",
        code: "-1",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  }

  // La connexion à la base est créée dans un bloc try/finally pour être fermée proprement
  let connection;
  try {
    // Ouverture de la connexion Oracle en utilisant la configuration centralisée
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    // Appel de la procédure stockée Oracle avec un paramètre IN (id) et un OUT (reto)
    const result = await connection.execute(
      `BEGIN :reto := package_tapi.get_package(p_id_package => :id); END;`,
      { reto: OUT_STRING, id }
    );

    let retour;
    try {
      // La procédure retourne une chaîne JSON dans le OUT bind, on la parse
      retour = JSON.parse(result.outBinds.reto);
    } catch (err) {
      // Si le JSON est invalide, on considère que c’est une erreur interne
      return res.status(500).json({
        errors: [{
          status: "500",
          title: "Erreur de parsing",
          detail: "La réponse Oracle n'est pas un JSON valide.",
          code: "-998",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }

    // Si Oracle a renvoyé une liste d’erreurs, on propage le status contenu dans la première
    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    // Cas nominal : la réponse contient un bloc data + meta, on renvoie tel quel
    if (retour.data && retour.meta) {
      return res.status(200).json(retour);
    }
    // Si le format est inattendu, on renvoie une erreur générique avec le contenu brut
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Format de réponse inattendu",
        detail: JSON.stringify(retour),
        code: "-997",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } catch (err) {
    // Journalisation de toute erreur non anticipée
    logger.log("error", err);
    // Gestion spécifique de certains codes Oracle (ex. enregistrement introuvable)
    if (err.errorNum === 20001 || err.errorNum === 1403) {
      return res.status(404).json({
        errors: [{
          status: "404",
          title: "Package non trouvé.",
          detail: "Aucun package trouvé pour cet id.",
          code: "100",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }
    // Tout autre cas est traité comme une erreur serveur générique
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Erreur serveur",
        detail: err.message || "Erreur non attrapée dans le catch",
        code: "-999",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } finally {
    // Fermeture systématique de la connexion si elle a été ouverte
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

// Route POST : crée un nouveau package avec les données envoyées dans le corps de la requête
// Appelle la procédure Oracle package_tapi.ins_package et insère un enregistrement
router.post("/packages", express.json(), async (req, res) => {
  // Récupération des données envoyées dans le corps de la requête (JSON)
  const packageData = req.body;
  // Vérifie que le corps de la requête existe
  if (!packageData) {
    return res.status(400).json({
      errors: [{
        status: "400",
        title: "Paramètre invalide",
        detail: "Le corps de la requête (packageData) est requis.",
        code: "-1",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  }

  let connection;
  try {
    // Connexion Oracle pour l’insertion
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    // Appel de la procédure d’insertion avec mapping des champs JS vers les paramètres PL/SQL
    const result = await connection.execute(
      `BEGIN
         :reto := package_tapi.ins_package(
            :hotel_name, :excursion, :transport_type, :guide_name,
            :length, :global_rating, :nb_ratings, :description, :price,
            :destination_id_destination, :id_destination, 'N'
         );
       END;`,
      {
        // Paramètre OUT qui recevra le JSON de retour
        reto: OUT_STRING,
        // On accepte plusieurs conventions de nommage (snake_case et camelCase)
        hotel_name: packageData.hotel_name ?? packageData.hotelName ?? "",
        excursion: packageData.excursion ?? "",
        transport_type: packageData.transport_type ?? packageData.transportType ?? "",
        guide_name: packageData.guide_name ?? packageData.guideName ?? "",
        length: packageData.length ?? 0,
        global_rating: packageData.global_rating ?? packageData.globalRating ?? 0,
        nb_ratings: packageData.nb_ratings ?? packageData.nbRatings ?? 0,
        description: packageData.description ?? "",
        price: packageData.price ?? 0,
        destination_id_destination: packageData.destination_id_destination ?? packageData.destinationId ?? null,
        id_destination: packageData.id_destination ?? packageData.idDestination ?? null
      }
    );

    // Validation explicite de la transaction côté Oracle
    await connection.commit();
    logger.log("info", "Package inséré avec succès.");

    let retour;
    try {
      // Parse du JSON renvoyé par la procédure
      retour = JSON.parse(result.outBinds.reto);
    } catch (e) {
      return res.status(500).json({
        errors: [{
          status: "500",
          title: "Erreur de parsing",
          detail: "La réponse Oracle n'est pas un JSON valide.",
          code: "-998",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }

    // Propagation des erreurs métier si présentes dans la réponse PL/SQL
    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    // Cas de succès : on renvoie la ressource créée avec un code 201
    if (retour.data && retour.meta) {
      retour.meta.statusCode = retour.meta.statusCode || 201;
      return res.status(201).json(retour);
    }
    // Format non prévu
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Format de réponse inattendu",
        detail: JSON.stringify(retour),
        code: "-997",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } catch (err) {
    // En cas d’exception technique, on log et renvoie une erreur 500
    logger.log("error", err);
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Erreur serveur",
        detail: err.message || "Erreur non attrapée dans le catch",
        code: "-999",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } finally {
    // Fermeture sécurisée de la connexion
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

// Route PUT : met à jour un package existant identifié par son ID
// Appelle la procédure Oracle package_tapi.upd_package avec les nouvelles valeurs
router.put("/packages/:id", express.json(), async (req, res) => {
  // Conversion de l’ID de l’URL en entier
  const id = parseInt(req.params.id, 10);
  // Données de mise à jour envoyées par le client
  const packageData = req.body;
  // Validation des paramètres d’entrée
  if (!id || isNaN(id) || !packageData) {
    return res.status(400).json({
      errors: [{
        status: "400",
        title: "Paramètres invalides",
        detail: "ID et données à mettre à jour requis.",
        code: "-1",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  }

  let connection;
  try {
    // Connexion Oracle pour la mise à jour
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    // Appel de la procédure d’update avec les champs modifiables
    const result = await connection.execute(
      `BEGIN
         :reto := package_tapi.upd_package(
            :id_package, :hotel_name, :excursion, :transport_type, :guide_name,
            :length, :global_rating, :nb_ratings, :description, :price,
            :destination_id_destination, :id_destination, 'N'
         );
       END;`,
      {
        reto: OUT_STRING,
        id_package: id,
        hotel_name: packageData.hotel_name ?? packageData.hotelName ?? null,
        excursion: packageData.excursion ?? null,
        transport_type: packageData.transport_type ?? packageData.transportType ?? null,
        guide_name: packageData.guide_name ?? packageData.guideName ?? null,
        length: packageData.length ?? null,
        global_rating: packageData.global_rating ?? packageData.globalRating ?? null,
        nb_ratings: packageData.nb_ratings ?? packageData.nbRatings ?? null,
        description: packageData.description ?? null,
        price: packageData.price ?? null,
        destination_id_destination: packageData.destination_id_destination ?? packageData.destinationId ?? null,
        id_destination: packageData.id_destination ?? packageData.idDestination ?? null
      }
    );

    // Validation de la transaction
    await connection.commit();

    let retour;
    try {
      // Traitement du JSON renvoyé par PL/SQL
      retour = JSON.parse(result.outBinds.reto);
    } catch (e) {
      return res.status(500).json({
        errors: [{
          status: "500",
          title: "Erreur de parsing",
          detail: "La réponse Oracle n'est pas un JSON valide.",
          code: "-998",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }

    // Si des erreurs métier sont renvoyées, on les propage avec le bon code HTTP
    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    // Retourne la ressource mise à jour en cas de succès
    if (retour.data && retour.meta) {
      return res.status(200).json(retour);
    }
    // Format non prévu
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Format de réponse inattendu",
        detail: JSON.stringify(retour),
        code: "-997",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } catch (err) {
    logger.log("error", err);
    // Si Oracle signale que le package n’existe pas, on renvoie un 404
    if (err.errorNum === 20001 || err.errorNum === 1403) {
      return res.status(404).json({
        errors: [{
          status: "404",
          title: "Package non trouvé.",
          detail: "Aucun package trouvé pour cet id.",
          code: "100",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }
    // Cas général : erreur serveur
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Erreur serveur",
        detail: err.message || "Erreur non attrapée dans le catch",
        code: "-999",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } finally {
    // Toujours fermer la connexion si elle existe
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

// Route DELETE : supprime un package à partir de son identifiant
// Appelle la procédure Oracle package_tapi.del_package pour marquer/supprimer l’enregistrement
router.delete("/packages/:id", async (req, res) => {
  // Récupération de l’ID du package à supprimer
  const id = parseInt(req.params.id, 10);
  // Validation : l’ID doit être fourni et numérique
  if (!id || isNaN(id)) {
    return res.status(400).json({
      errors: [{
        status: "400",
        title: "Paramètre manquant",
        detail: "Le paramètre p_id_package est requis.",
        code: "-1",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  }

  let connection;
  try {
    // Connexion Oracle pour la suppression
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    // Appel de la procédure de suppression logique/physique côté Oracle
    const result = await connection.execute(
      `BEGIN :reto := package_tapi.del_package(:p_id_package, 'N'); END;`,
      { reto: OUT_STRING, p_id_package: id }
    );

    // Validation de la suppression
    await connection.commit();

    let retour;
    try {
      // Parse du JSON retourné par la procédure
      retour = JSON.parse(result.outBinds.reto);
    } catch (e) {
      return res.status(500).json({
        errors: [{
          status: "500",
          title: "Erreur de parsing",
          detail: "La réponse Oracle n'est pas un JSON valide.",
          code: "-998",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }

    // Si des erreurs sont présentes, on renvoie le status correspondant
    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    // En cas de succès, certaines implémentations renvoient seulement meta ou data + meta
    if (retour.meta || (retour.data && retour.meta)) {
      return res.status(200).json(retour);
    }
    // Format non attendu de la réponse
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Format de réponse inattendu",
        detail: JSON.stringify(retour),
        code: "-997",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } catch (err) {
    logger.log("error", err);
    // Gestion spécifique quand Oracle indique que l’enregistrement n’existe pas
    if (err.errorNum === 20001 || err.errorNum === 1403) {
      return res.status(404).json({
        errors: [{
          status: "404",
          title: "Package non trouvé",
          detail: "Aucun package trouvé pour cette suppression",
          code: "100",
          meta: { timestamp: new Date().toISOString() }
        }]
      });
    }
    // Toute autre erreur est renvoyée comme erreur serveur
    return res.status(500).json({
      errors: [{
        status: "500",
        title: "Erreur serveur",
        detail: err.message || "Erreur non attrapée dans le catch",
        code: "-999",
        meta: { timestamp: new Date().toISOString() }
      }]
    });
  } finally {
    // Fermeture de la connexion en toutes circonstances
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

export default router;
