import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";

const router = express.Router();

function formatDateValue(d) {
  if (!d) return "";
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  const s = String(d);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function mapReservationStatus(s) {
  if (!s) return "À venir";
  const raw = String(s).trim();
  if (raw === "Validée" || raw === "À venir" || raw === "Annulée") return raw;
  const u = raw.toUpperCase();
  if (u.includes("CANCEL")) return "Annulée";
  if (u.includes("VALID") || u.includes("CONFIRM") || u === "COMPLETED") return "Validée";
  if (u.includes("PEND") || u.includes("UPCOM")) return "À venir";
  return raw;
}

router.get("/reservations/user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (!userId || Number.isNaN(userId)) {
    return res.status(400).json({ error: "Identifiant utilisateur invalide." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT r.ID_RESERVATION, r.DATE_START, r.DATE_END, r.NB_TRAVELERS, r.PRICE, r.STATUS,
              d.CITY, d.COUNTRY, d.IMAGE_LINK
       FROM RESERVATION r
       INNER JOIN TRIP t ON r.TRIP_ID_TRIP = t.ID_TRIP
       INNER JOIN PACKAGE p ON t.PACKAGE_ID_PACKAGE = p.ID_PACKAGE
       INNER JOIN DESTINATION d ON p.DESTINATION_ID_DESTINATION = d.ID_DESTINATION
       WHERE r.USERS_ID_USERS = :userId
       ORDER BY r.DATE_START DESC`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = (result.rows || []).map((row) => ({
      id: row.ID_RESERVATION,
      destination: row.CITY,
      country: row.COUNTRY,
      startDate: formatDateValue(row.DATE_START),
      endDate: formatDateValue(row.DATE_END),
      travelers: row.NB_TRAVELERS,
      status: mapReservationStatus(row.STATUS),
      price: row.PRICE,
      imgUrl:
        row.IMAGE_LINK ||
        "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
    }));

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.get("/reservations/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN reservation_tapi.select_reservation(:id); END;`,
      { id: req.params.id }
    );
    console.log(`Réservation avec l'ID ${req.params.id} affichée`);
    res.json({ message: `Réservation ${req.params.id} récupérée avec succès` });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// post
router.post("/reservations", express.json(), async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN reservation_tapi.insert_reservation(
        :id_reservation, :reference_number, :reservation_date,
        :date_start, :date_end, :nb_travelers,
        :price, :status, :users_id_users,
        :trip_id_trip, :id_trip
      ); END;`,
      {
        id_reservation:   req.body.id_reservation,
        reference_number: req.body.reference_number,
        reservation_date: new Date(req.body.reservation_date),
        date_start:       new Date(req.body.date_start),
        date_end:         new Date(req.body.date_end),
        nb_travelers:     req.body.nb_travelers,
        price:            req.body.price,
        status:           req.body.status,
        users_id_users:   req.body.users_id_users,
        trip_id_trip:     req.body.trip_id_trip,
        id_trip:          req.body.id_trip
      }
    );
    await connection.commit();
    console.log(`Réservation ID ${req.body.id_reservation} créée avec succès`);
    res.json({ message: `Réservation ${req.body.id_reservation} créée avec succès` });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

//Il devrait avoir une autre route PUT ici mais je n'avais pas le temps de le faire.

// delete
router.delete("/reservations/:id", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute (
            `BEGIN reservation_tapi.delete_reservation(:id); END;`,
            { id: req.params.id }
        );
        await connection.commit();
        console.log(`Réservation avec l'ID ${req.params.id} supprimée`)
        res.json({ message: `Réservation ${req.params.id} supprimée avec succès`})
    }  catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

export default router;