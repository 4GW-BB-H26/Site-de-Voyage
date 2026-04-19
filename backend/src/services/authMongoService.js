/**
 * Logique d’inscription / connexion / MAJ compte quand AUTH_MODE=mongo.
 * Les documents vivent dans utilisateurs_auth ; id_users est un entier auto-incrémenté maison.
 */
import { authUsersCollection } from "../models/auth_user_model.js";
import { hasherMotDePasse, verifierMotDePasseStocke } from "../utils/password.js";
import { creerJetonUtilisateur } from "../utils/jetonsJwt.js";

/** Mongo n’est pas là : on n’a pas de collection à interroger */
function indisponible() {
  return {
    erreur: {
      status: 503,
      payload: {
        success: false,
        message:
          "Le service de comptes (MongoDB) n’est pas joignable. Vérifie que Mongo tourne et que MONGODB_URI est bon, ou repasse en AUTH_MODE=oracle.",
      },
    },
  };
}

/** Numéro utilisateur suivant, à la main, sans séquence Oracle */
async function prochainIdUsers(coll) {
  const last = await coll.find().sort({ id_users: -1 }).limit(1).toArray();
  const n = last[0]?.id_users;
  return typeof n === "number" && Number.isFinite(n) ? n + 1 : 1;
}

/** Même logique que login Oracle, mais lecture dans la collection utilisateurs_auth */
export async function loginAvecIdentifiantsMongo(email, password) {
  const coll = authUsersCollection();
  if (!coll) return indisponible();

  const courriel = String(email).trim().toLowerCase();
  try {
    const row = await coll.findOne({ email: courriel });
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

    const stored = row.password;
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
      const hachageMotDePasse = await hasherMotDePasse(password);
      await coll.updateOne(
        { _id: row._id },
        { $set: { password: hachageMotDePasse } }
      );
    }

    const user = {
      id_users: Number(row.id_users),
      first_name: row.first_name,
      last_name: row.last_name,
      username: row.username,
      email: row.email,
    };
    return { user };
  } catch (err) {
    console.error("Connexion Mongo (auth) :", err);
    return {
      erreur: {
        status: 500,
        nextErr: err,
      },
    };
  }
}

/** Inscription : vérifie doublons, hash le mot de passe, émet un JWT comme côté Oracle */
export async function createUserMongo(body) {
  const coll = authUsersCollection();
  if (!coll) return { erreur: indisponible().erreur };

  const prenom = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const nom = typeof body.last_name === "string" ? body.last_name.trim() : "";
  const nomUtilisateur =
    typeof body.username === "string" ? body.username.trim() : "";
  const courriel =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = body.password;

  if (
    !prenom ||
    !nom ||
    !nomUtilisateur ||
    !courriel ||
    typeof password !== "string" ||
    !password.trim()
  ) {
    return {
      erreur: {
        status: 400,
        payload: { success: false, message: "Tous les champs sont requis." },
      },
    };
  }

  try {
    const exist = await coll.findOne({
      $or: [{ email: courriel }, { username: nomUtilisateur }],
    });
    if (exist) {
      return {
        erreur: {
          status: 409,
          payload: {
            success: false,
            message: "Ce courriel ou ce nom d'utilisateur existe deja.",
          },
        },
      };
    }

    const hachageMotDePasse = await hasherMotDePasse(password);
    const id_users = await prochainIdUsers(coll);
    const doc = {
      id_users,
      first_name: prenom,
      last_name: nom,
      username: nomUtilisateur,
      email: courriel,
      password: hachageMotDePasse,
      creationDate: new Date(),
    };
    await coll.insertOne(doc);

    const user = {
      id_users,
      first_name: prenom,
      last_name: nom,
      username: nomUtilisateur,
      email: courriel,
    };
    const token = creerJetonUtilisateur(user);
    return { status: 201, user, token };
  } catch (err) {
    console.error("Inscription Mongo :", err);
    return { erreur: { status: 500, nextErr: err } };
  }
}

/** PUT profil : même champs que la route Oracle ; mot de passe optionnel */
export async function updateUserMongo(idParam, body) {
  const coll = authUsersCollection();
  if (!coll) return { erreur: indisponible().erreur };

  const id = parseInt(idParam, 10);
  if (!id || Number.isNaN(id)) {
    return {
      erreur: {
        status: 400,
        payload: { success: false, message: "Identifiant invalide." },
      },
    };
  }

  try {
    const set = {
      first_name: body.first_name,
      last_name: body.last_name,
      username: body.username,
      email: String(body.email).trim().toLowerCase(),
    };
    const newPassword = body.password;
    const passwordProvided =
      newPassword !== undefined &&
      newPassword !== null &&
      String(newPassword).trim() !== "";

    if (passwordProvided) {
      set.password = await hasherMotDePasse(String(newPassword));
    }

    const result = await coll.updateOne({ id_users: id }, { $set: set });
    if (result.matchedCount === 0) {
      return {
        erreur: {
          status: 404,
          payload: { success: false, message: "Utilisateur introuvable." },
        },
      };
    }
    return { success: true, rowsAffected: result.modifiedCount };
  } catch (err) {
    console.error("Mise à jour du profil (Mongo) :", err);
    return { erreur: { status: 500, nextErr: err } };
  }
}

/** Suppression du document par id_users (numérique, identique au schéma JWT) */
export async function deleteUserMongo(idParam) {
  const coll = authUsersCollection();
  if (!coll) return { erreur: indisponible().erreur };

  const id = parseInt(idParam, 10);
  if (!id || Number.isNaN(id)) {
    return {
      erreur: {
        status: 400,
        payload: { success: false, message: "Identifiant invalide." },
      },
    };
  }

  try {
    const result = await coll.deleteOne({ id_users: id });
    if (result.deletedCount === 0) {
      return {
        erreur: {
          status: 404,
          payload: { success: false, message: "Utilisateur introuvable." },
        },
      };
    }
    return { success: true, rowsAffected: result.deletedCount };
  } catch (err) {
    console.error("Suppression du compte (Mongo) :", err);
    return { erreur: { status: 500, nextErr: err } };
  }
}
