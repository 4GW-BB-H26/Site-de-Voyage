import oracledb from "oracledb";
import dbConfig from "../config/db.js";
import { OUT_STRING } from "../config/oracle.js";

export async function getDestination(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `BEGIN :reto := destination_tapi.get_destination(:id); END;`,
      { reto: OUT_STRING, id: req.params.id }
    );
    console.log(`Destination avec l'ID ${req.params.id} affichée`);
    res.json(JSON.parse(result.outBinds.reto));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function createDestination(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `BEGIN :reto := destination_tapi.ins_destination(:city, :country, :image_link, 'N'); END;`,
      {
        reto: OUT_STRING,
        city: req.body.city,
        country: req.body.country,
        image_link: req.body.image_link || req.body.imageLink,
      }
    );
    await connection.commit();
    console.log(`Destination '${req.body.city}' ajoutée avec succès`);
    res.json(JSON.parse(result.outBinds.reto));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function updateDestination(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `BEGIN :reto := destination_tapi.upd_destination(:city, :id, :country, :image_link, 'N'); END;`,
      {
        reto: OUT_STRING,
        city: req.body.city,
        id: req.params.id,
        country: req.body.country,
        image_link: req.body.image_link || req.body.imageLink,
      }
    );
    await connection.commit();
    console.log(`Destination avec l'ID ${req.params.id} modifiée`);
    res.json(JSON.parse(result.outBinds.reto));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function deleteDestination(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `BEGIN :reto := destination_tapi.del_destination(:id, 'N'); END;`,
      { reto: OUT_STRING, id: req.params.id }
    );
    await connection.commit();
    console.log(`Destination avec l'ID ${req.params.id} supprimée`);
    res.json(JSON.parse(result.outBinds.reto));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
