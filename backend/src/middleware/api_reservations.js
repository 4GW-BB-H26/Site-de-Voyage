import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";

const router = express.Router();

// get
router.get("/reservations/:id", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN reservation_tapi.select_reservation(:id); END;`,
      { id: req.params.id }
    );
    console.log(`Réservation avec l'ID ${req.params.id} affichée`);
    res.json({ message: `Réservation ${req.params.id} récupérée avec succès` });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// post
router.post("/reservations", express.json(), async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
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
  }
});

//Il devrait avoir une autre route PUT ici mais je n'avais pas le temps de le faire.

// delete
router.delete("/reservations/:id", async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
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
    }
});

export default router;