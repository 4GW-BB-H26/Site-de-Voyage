import oracledb from "oracledb";
import dbConfig from "../config/db.js";
import { hasherMotDePasse, verifierMotDePasseStocke } from "../utils/password.js";
import { creerJetonUtilisateur } from "../utils/jetonsJwt.js";

/**
 * @returns {Promise<{ erreur: { status: number; payload: object } } | { user: object }>}
 */
async function loginAvecIdentifiants(email, password) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD
       FROM USERS
       WHERE EMAIL = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const row = result.rows[0];
    if (!row) {
      return {
        erreur: {
          status: 401,
          payload: {
            success: false,
            message: "Courriel ou mot de passe incorrect.",
          },
        },
      };
    }

    const stored = row.PASSWORD ?? row.password;
    const { valide, necessiteRehachage } = await verifierMotDePasseStocke(
      password,
      stored
    );
    if (!valide) {
      return {
        erreur: {
          status: 401,
          payload: {
            success: false,
            message: "Courriel ou mot de passe incorrect.",
          },
        },
      };
    }

    if (necessiteRehachage) {
      try {
        const hachageMotDePasse = await hasherMotDePasse(password);
        await connection.execute(
          `UPDATE USERS SET PASSWORD = :password WHERE ID_USERS = :id`,
          { password: hachageMotDePasse, id: row.ID_USERS }
        );
        await connection.commit();
      } catch (rehashErr) {
        console.error("Échec migration hash mot de passe: ", rehashErr);
      }
    }

    const user = {
      id_users: Number(row.ID_USERS),
      first_name: row.FIRST_NAME,
      last_name: row.LAST_NAME,
      username: row.USERNAME,
      email: row.EMAIL,
    };
    return { user };
  } catch (err) {
    console.error("connexion: ", err);
    return {
      erreur: {
        status: 500,
        nextErr: err,
      },
    };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function getUser(req, res, next) {
  const email = req.query.email;
  const password = req.query.password;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Courriel et mot de passe requis.",
    });
  }

  const resultat = await loginAvecIdentifiants(email, password);
  if (resultat.erreur) {
    if (resultat.erreur.nextErr) return next(resultat.erreur.nextErr);
    return res.status(resultat.erreur.status).json(resultat.erreur.payload);
  }

  const token = creerJetonUtilisateur(resultat.user);
  return res.json({
    success: true,
    user: resultat.user,
    token,
  });
}

export async function postAuthLogin(req, res, next) {
  const email = req.body?.email;
  const password = req.body?.password;
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Courriel et mot de passe requis.",
    });
  }

  const resultat = await loginAvecIdentifiants(email.trim(), password);
  if (resultat.erreur) {
    if (resultat.erreur.nextErr) return next(resultat.erreur.nextErr);
    return res.status(resultat.erreur.status).json(resultat.erreur.payload);
  }

  const token = creerJetonUtilisateur(resultat.user);
  return res.json({
    success: true,
    user: resultat.user,
    token,
  });
}

export function getAuthMe(req, res) {
  const u = req.utilisateurJwt;
  return res.json({
    success: true,
    user: {
      id_users: u.id_users,
      email: u.email,
      username: u.username,
    },
  });
}

export async function createUser(req, res, next) {
  const { first_name, last_name, username, email, password } = req.body || {};
  const prenom = typeof first_name === "string" ? first_name.trim() : "";
  const nom = typeof last_name === "string" ? last_name.trim() : "";
  const nomUtilisateur = typeof username === "string" ? username.trim() : "";
  const courriel = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (
    !prenom ||
    !nom ||
    !nomUtilisateur ||
    !courriel ||
    typeof password !== "string" ||
    !password.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont requis.",
    });
  }

  let connection;
  try {
    const hachageMotDePasse = await hasherMotDePasse(password);
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO USERS (ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD, CREATION_DATE)
       VALUES ((SELECT NVL(MAX(ID_USERS), 0) + 1 FROM USERS), :first_name, :last_name, :username, :email, :password, SYSDATE)`,
      {
        first_name: prenom,
        last_name: nom,
        username: nomUtilisateur,
        email: courriel,
        password: hachageMotDePasse,
      }
    );
    await connection.commit();

    const created = await connection.execute(
      `SELECT ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL
       FROM USERS
       WHERE EMAIL = :email`,
      { email: courriel },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const row = created.rows?.[0];
    const user = row
      ? {
          id_users: Number(row.ID_USERS),
          first_name: row.FIRST_NAME,
          last_name: row.LAST_NAME,
          username: row.USERNAME,
          email: row.EMAIL,
        }
      : null;

    const token = user ? creerJetonUtilisateur(user) : null;
    return res.status(201).json({
      success: true,
      user,
      ...(token ? { token } : {}),
    });
  } catch (err) {
    console.error("Erreur dans le POST: ", err);
    if (err.errorNum === 1) {
      return res.status(409).json({
        success: false,
        message: "Ce courriel ou ce nom d'utilisateur existe deja.",
      });
    }
    return next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function updateUser(req, res, next) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const newPassword = req.body.password;
    const passwordProvided =
      newPassword !== undefined &&
      newPassword !== null &&
      String(newPassword).trim() !== "";

    let result;
    if (passwordProvided) {
      const hachageMotDePasse = await hasherMotDePasse(String(newPassword));
      result = await connection.execute(
        `UPDATE USERS
         SET FIRST_NAME = :first_name, LAST_NAME = :last_name, USERNAME = :username, EMAIL = :email, PASSWORD = :password
         WHERE ID_USERS = :id`,
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          email: req.body.email,
          password: hachageMotDePasse,
          id: req.params.id,
        }
      );
    } else {
      result = await connection.execute(
        `UPDATE USERS
         SET FIRST_NAME = :first_name, LAST_NAME = :last_name, USERNAME = :username, EMAIL = :email
         WHERE ID_USERS = :id`,
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          email: req.body.email,
          id: req.params.id,
        }
      );
    }

    await connection.commit();
    return res.json({ success: true, rowsAffected: result.rowsAffected });
  } catch (err) {
    console.error("erreur dans le PUT: ", err);
    return next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function deleteUser(req, res, next) {
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
    return next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
