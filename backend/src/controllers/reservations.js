import oracledb from "oracledb";
import dbConfig from "../config/db.js";

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

export async function listReservationsByUser(req, res) {
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
    if (connection) await connection.close();
  }
}

export async function getReservation(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Identifiant de réservation invalide." });
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
       WHERE r.ID_RESERVATION = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    const row = result.rows[0];
    return res.json({
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
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  } finally {
    if (connection) await connection.close();
  }
}

export async function createReservation(req, res) {
  const {
    id_reservation, reference_number, reservation_date,
    date_start, date_end, nb_travelers,
    price, status, users_id_users,
    trip_id_trip, id_trip,
  } = req.body;

  if (!id_reservation || !users_id_users || !trip_id_trip) {
    return res.status(400).json({ error: "Paramètres requis manquants." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO RESERVATION (
        ID_RESERVATION, REFERENCE_NUMBER, RESERVATION_DATE,
        DATE_START, DATE_END, NB_TRAVELERS,
        PRICE, STATUS, USERS_ID_USERS,
        TRIP_ID_TRIP, ID_TRIP
      ) VALUES (
        :id_reservation, :reference_number, :reservation_date,
        :date_start, :date_end, :nb_travelers,
        :price, :status, :users_id_users,
        :trip_id_trip, :id_trip
      )`,
      {
        id_reservation,
        reference_number,
        reservation_date: new Date(reservation_date),
        date_start: new Date(date_start),
        date_end: new Date(date_end),
        nb_travelers,
        price,
        status,
        users_id_users,
        trip_id_trip,
        id_trip,
      }
    );
    await connection.commit();
    console.log(`Réservation ID ${id_reservation} créée avec succès`);
    return res.status(201).json({ message: `Réservation ${id_reservation} créée avec succès` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  } finally {
    if (connection) await connection.close();
  }
}

export async function cancelReservation(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Identifiant de réservation invalide." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const check = await connection.execute(
      `SELECT DATE_START, STATUS FROM RESERVATION WHERE ID_RESERVATION = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!check.rows || check.rows.length === 0) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    const row = check.rows[0];
    if (new Date(row.DATE_START) <= new Date()) {
      return res.status(400).json({ error: "Impossible d'annuler un voyage déjà commencé." });
    }

    await connection.execute(
      `UPDATE RESERVATION SET STATUS = 'Annulée' WHERE ID_RESERVATION = :id`,
      { id }
    );
    await connection.commit();
    console.log(`Réservation avec l'ID ${id} annulée`);
    return res.json({ message: `Réservation ${id} annulée avec succès` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  } finally {
    if (connection) await connection.close();
  }
}

export async function deleteReservation(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Identifiant de réservation invalide." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM RESERVATION WHERE ID_RESERVATION = :id`,
      { id }
    );
    await connection.commit();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    console.log(`Réservation avec l'ID ${id} supprimée`);
    return res.json({ message: `Réservation ${id} supprimée avec succès` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  } finally {
    if (connection) await connection.close();
  }
}
