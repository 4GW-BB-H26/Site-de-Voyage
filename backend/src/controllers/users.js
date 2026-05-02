/**
 * Comptes utilisateurs : inscription, connexion, profil, suppression.
 * Selon AUTH_MODE, la persistance passe par Oracle (USERS) ou Mongo (authMongoService).
 */
import oracledb from "oracledb";
import dbConfig from "../config/db.js";
import { useMongoAuth } from "../config/auth.js";
import { hasherMotDePasse, verifierMotDePasseStocke } from "../utils/password.js";
import { creerJetonUtilisateur } from "../utils/jetonsJwt.js";
import {
  loginAvecIdentifiantsMongo,
  createUserMongo,
  updateUserMongo,
  deleteUserMongo,
} from "../services/authMongoService.js";

/**
 * Vérifie courriel + mot de passe et renvoie soit l’utilisateur, soit une erreur structurée.
 */
async function loginAvecIdentifiants(email, password) {
  const courriel = String(email).trim().toLowerCase();

  if (useMongoAuth) {
    return loginAvecIdentifiantsMongo(courriel, password);
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    // Requête paramétrée pour éviter l'injection SQL.
    const result = await connection.execute(
      `SELECT ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD
       FROM USERS
       WHERE LOWER(EMAIL) = :email`,
      { email: courriel },
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
        console.error("Impossible de mettre le mot de passe au format attendu :", rehashErr);
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
    console.error("Problème pendant la connexion (Oracle) :", err);
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

/** GET /user?email=&password= — connexion “legacy” par query string (même effet qu’un login) */
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

/** POST /auth/login — connexion JSON utilisée par le frontend */
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

/** GET /auth/me — infos minimales dérivées du JWT (middleware exigerJetonValide) */
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

/** POST /users — inscription ; renvoie user + token si tout va bien */
export async function createUser(req, res, next) {
  if (useMongoAuth) {
    const out = await createUserMongo(req.body || {});
    if (out.erreur) {
      if (out.erreur.nextErr) return next(out.erreur.nextErr);
      return res.status(out.erreur.status).json(out.erreur.payload);
    }
    return res.status(out.status).json({
      success: true,
      user: out.user,
      token: out.token,
    });
  }

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
    // On verrouille la table le temps de l’insert : avec MAX(ID)+1, deux requêtes en même temps
    // pourraient sinon réserver le même numéro.
    await connection.execute(`LOCK TABLE USERS IN EXCLUSIVE MODE`);
    // Requête paramétrée pour éviter l'injection SQL.
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
    console.error("Inscription (Oracle) :", err);
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

/** PUT /users/:id — JWT requis, id doit correspondre au jeton */
export async function updateUser(req, res, next) {
  if (useMongoAuth) {
    const out = await updateUserMongo(req.params.id, req.body || {});
    if (out.erreur) {
      if (out.erreur.nextErr) return next(out.erreur.nextErr);
      return res.status(out.erreur.status).json(out.erreur.payload);
    }
    return res.json({ success: true, rowsAffected: out.rowsAffected });
  }

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
    console.error("Mise à jour du profil (Oracle) :", err);
    return next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/** DELETE /users/:id — même règle de sécurité que le PUT */
export async function deleteUser(req, res, next) {
  if (useMongoAuth) {
    const out = await deleteUserMongo(req.params.id);
    if (out.erreur) {
      if (out.erreur.nextErr) return next(out.erreur.nextErr);
      return res.status(out.erreur.status).json(out.erreur.payload);
    }
    return res.json({ success: true, rowsAffected: out.rowsAffected });
  }

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
    console.error("Suppression du compte (Oracle) :", err);
    return next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
