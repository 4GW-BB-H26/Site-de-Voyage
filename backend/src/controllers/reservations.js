import oracledb from "oracledb";
import dbConfig from "../config/db.js";

const STATUS_PAR_DEFAUT = "À venir";

function formatDateValue(d) {
  if (!d) return "";
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  const s = String(d);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function parsePositiveInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseDateOrNull(value) {
  if (value == null || String(value).trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapReservationStatus(s) {
  if (!s) return STATUS_PAR_DEFAUT;
  const raw = String(s).trim();
  if (raw === "Validée" || raw === STATUS_PAR_DEFAUT || raw === "Annulée") return raw;
  const u = raw.toUpperCase();
  if (u.includes("CANCEL")) return "Annulée";
  if (u.includes("VALID") || u.includes("CONFIRM") || u === "COMPLETED") return "Validée";
  if (u.includes("PEND") || u.includes("UPCOM")) return STATUS_PAR_DEFAUT;
  return raw;
}

export async function listReservationsByUser(req, res, next) {
  const userId = parsePositiveInt(req.params.userId);
  if (!userId) {
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
    return next(err);
  } finally {
    if (connection) await connection.close();
  }
}

export async function getReservation(req, res, next) {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Identifiant de réservation invalide." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT r.ID_RESERVATION, r.USERS_ID_USERS, r.DATE_START, r.DATE_END, r.NB_TRAVELERS, r.PRICE, r.STATUS,
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
    const jwtUserId = req.utilisateurJwt?.id_users;
    if (jwtUserId != null && Number(row.USERS_ID_USERS) !== Number(jwtUserId)) {
      return res.status(403).json({
        error: "Accès refusé à cette réservation.",
      });
    }

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
    return next(err);
  } finally {
    if (connection) await connection.close();
  }
}

export async function createReservation(req, res, next) {
  const {
    id_reservation,
    reference_number,
    reservation_date,
    date_start,
    date_end,
    nb_travelers,
    price,
    status,
    users_id_users,
    trip_id_trip,
    id_trip,
  } = req.body || {};

  const userId = parsePositiveInt(users_id_users);
  const tripId = parsePositiveInt(trip_id_trip);
  const idTrip = parsePositiveInt(id_trip) ?? tripId;

  if (!userId || !tripId) {
    return res.status(400).json({ error: "Paramètres requis manquants." });
  }

  const startDate = parseDateOrNull(date_start);
  const endDate = parseDateOrNull(date_end);
  const reservationDate = parseDateOrNull(reservation_date) ?? new Date();
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Dates invalides." });
  }
  if (startDate > endDate) {
    return res.status(400).json({ error: "La date de fin doit être après la date de début." });
  }

  const travelers = parsePositiveInt(nb_travelers);
  if (!travelers) {
    return res.status(400).json({ error: "nb_travelers doit être un entier positif." });
  }

  const finalPrice = Number(price);
  if (!Number.isFinite(finalPrice) || finalPrice < 0) {
    return res.status(400).json({ error: "price doit être un nombre positif." });
  }

  const finalStatus = String(status ?? STATUS_PAR_DEFAUT).trim() || STATUS_PAR_DEFAUT;
  const finalRef = String(reference_number ?? "").trim() || `RES-${Date.now()}`;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    let reservationId = parsePositiveInt(id_reservation);
    if (!reservationId) {
      const idResult = await connection.execute(
        `SELECT NVL(MAX(ID_RESERVATION), 0) + 1 AS NEXT_ID FROM RESERVATION`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      reservationId = Number(idResult.rows?.[0]?.NEXT_ID);
    }

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
        id_reservation: reservationId,
        reference_number: finalRef,
        reservation_date: reservationDate,
        date_start: startDate,
        date_end: endDate,
        nb_travelers: travelers,
        price: finalPrice,
        status: finalStatus,
        users_id_users: userId,
        trip_id_trip: tripId,
        id_trip: idTrip,
      }
    );
    await connection.commit();
    return res.status(201).json({
      success: true,
      reservationId,
      message: `Réservation ${reservationId} créée avec succès.`,
    });
  } catch (err) {
    console.error("Erreur createReservation:", err);
    return next(err);
  } finally {
    if (connection) await connection.close();
  }
}

export async function cancelReservation(req, res, next) {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Identifiant de réservation invalide." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const check = await connection.execute(
      `SELECT DATE_START, STATUS, USERS_ID_USERS FROM RESERVATION WHERE ID_RESERVATION = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!check.rows || check.rows.length === 0) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    const row = check.rows[0];
    const jwtUserId = req.utilisateurJwt?.id_users;
    if (jwtUserId != null && Number(row.USERS_ID_USERS) !== Number(jwtUserId)) {
      return res.status(403).json({
        error: "Vous ne pouvez pas annuler la réservation d'un autre utilisateur.",
      });
    }

    if (mapReservationStatus(row.STATUS) === "Annulée") {
      return res.status(409).json({
        error: "Cette réservation est déjà annulée.",
      });
    }

    if (new Date(row.DATE_START) <= new Date()) {
      return res.status(400).json({ error: "Impossible d'annuler un voyage déjà commencé." });
    }

    await connection.execute(
      `UPDATE RESERVATION SET STATUS = 'Annulée' WHERE ID_RESERVATION = :id`,
      { id }
    );
    await connection.commit();
    return res.json({
      success: true,
      message: `Réservation ${id} annulée avec succès.`,
    });
  } catch (err) {
    console.error("Erreur cancelReservation:", err);
    return next(err);
  } finally {
    if (connection) await connection.close();
  }
}

export async function deleteReservation(req, res, next) {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Identifiant de réservation invalide." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const owner = await connection.execute(
      `SELECT USERS_ID_USERS FROM RESERVATION WHERE ID_RESERVATION = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (!owner.rows || owner.rows.length === 0) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    const jwtUserId = req.utilisateurJwt?.id_users;
    if (jwtUserId != null && Number(owner.rows[0].USERS_ID_USERS) !== Number(jwtUserId)) {
      return res.status(403).json({
        error: "Vous ne pouvez pas supprimer la réservation d'un autre utilisateur.",
      });
    }

    const result = await connection.execute(
      `DELETE FROM RESERVATION WHERE ID_RESERVATION = :id`,
      { id }
    );
    await connection.commit();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }

    return res.json({
      success: true,
      message: `Réservation ${id} supprimée avec succès.`,
    });
  } catch (err) {
    console.error("Erreur deleteReservation:", err);
    return next(err);
  } finally {
    if (connection) await connection.close();
  }
}
