//API pour la table USERS
//Ce script a ete inspiree du fichier Revision mysql avec nodejs fourni pas m.Rim Mseddi

import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";

const router = express.Router();

router.get("/user", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Courriel et mot de passe requis.",
    });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL
       FROM USERS
       WHERE EMAIL = :email AND PASSWORD = :password`,
      { email, password },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      return res.status(401).json({
        success: false,
        message: "Courriel ou mot de passe incorrect.",
      });
    }

    const row = result.rows[0];
    return res.json({
      success: true,
      user: {
        id_users: row.ID_USERS,
        first_name: row.FIRST_NAME,
        last_name: row.LAST_NAME,
        username: row.USERNAME,
        email: row.EMAIL,
      },
    });
  } catch (err) {
    console.error("erreur dans le GET: ", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.post("/users", express.json(), async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body || {};
  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont requis.",
    });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO USERS (ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD, CREATION_DATE)
       VALUES ((SELECT NVL(MAX(ID_USERS), 0) + 1 FROM USERS), :first_name, :last_name, :username, :email, :password, SYSDATE)`,
      { first_name, last_name, username, email, password }
    );
    await connection.commit();
    return res.status(201).json({
      success: true,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("Erreur dans le POST: ", err);
    if (err.errorNum === 1) {
      return res.status(409).json({
        success: false,
        message: "Ce courriel ou ce nom d'utilisateur existe deja.",
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.put("/users/:id", express.json(), async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE USERS
       SET FIRST_NAME = :first_name, LAST_NAME = :last_name, USERNAME = :username, EMAIL = :email, PASSWORD = :password
       WHERE ID_USERS = :id`,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        id: req.params.id,
      }
    );
    await connection.commit();
    return res.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (err) {
    console.error("erreur dans le PUT: ", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/users/:id", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM USERS WHERE ID_USERS = :id`,
      { id: req.params.id }
    );
    await connection.commit();
    return res.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (err) {
    console.error("Erreur d'effacement dans le DELETE ", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

export default router;
