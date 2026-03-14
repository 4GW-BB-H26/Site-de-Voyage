import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";
import logger from "./logger.js";

const router = express.Router();
const OUT_STRING = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40000 };

/**
 * GET: Récupérer un package par ID
 */
router.get("/packages/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
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
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    const result = await connection.execute(
      `BEGIN :reto := package_tapi.get_package(p_id_package => :id); END;`,
      { reto: OUT_STRING, id }
    );

    let retour;
    try {
      retour = JSON.parse(result.outBinds.reto);
    } catch (err) {
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

    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    if (retour.data && retour.meta) {
      return res.status(200).json(retour);
    }
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
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

/**
 * POST: Créer un nouveau package
 */
router.post("/packages", express.json(), async (req, res) => {
  const packageData = req.body;
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
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    const result = await connection.execute(
      `BEGIN
         :reto := package_tapi.ins_package(
            :hotel_name, :excursion, :transport_type, :guide_name,
            :length, :global_rating, :nb_ratings, :description, :price,
            :destination_id_destination, :id_destination, 'N'
         );
       END;`,
      {
        reto: OUT_STRING,
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

    await connection.commit();
    logger.log("info", "Package inséré avec succès.");

    let retour;
    try {
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

    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    if (retour.data && retour.meta) {
      retour.meta.statusCode = retour.meta.statusCode || 201;
      return res.status(201).json(retour);
    }
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
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

/**
 * PUT: Mettre à jour un package
 */
router.put("/packages/:id", express.json(), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const packageData = req.body;
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
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

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

    await connection.commit();

    let retour;
    try {
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

    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    if (retour.data && retour.meta) {
      return res.status(200).json(retour);
    }
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
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }
});

/**
 * DELETE: Supprimer un package
 */
router.delete("/packages/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
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
    connection = await oracledb.getConnection(dbConfig);
    logger.log("info", "Connexion réussie à la base de données Oracle");

    const result = await connection.execute(
      `BEGIN :reto := package_tapi.del_package(:p_id_package, 'N'); END;`,
      { reto: OUT_STRING, p_id_package: id }
    );

    await connection.commit();

    let retour;
    try {
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

    if (retour.errors && Array.isArray(retour.errors)) {
      const status = parseInt(retour.errors[0]?.status || "500", 10);
      return res.status(status).json({ errors: retour.errors });
    }
    if (retour.meta || (retour.data && retour.meta)) {
      return res.status(200).json(retour);
    }
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
