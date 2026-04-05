import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";

export function exigerJetonValide(req, res, next) {
  const header = req.headers.authorization;
  const match = header && header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Jeton manquant ou invalide.",
    });
  }
  try {
    const payload = jwt.verify(match[1], jwtSecret);
    const idBrut = payload.id_users ?? payload.sub;
    const id_users = Number(idBrut);
    if (!Number.isFinite(id_users)) {
      return res.status(401).json({
        success: false,
        message: "Jeton invalide.",
      });
    }
    req.utilisateurJwt = {
      id_users,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Jeton expire ou invalide.",
    });
  }
}

/**
 * Vérifie que :id (ou autre param) correspond à l'utilisateur du JWT.
 * @param {string} nomParam
 */
export function exigerRessourceUtilisateur(nomParam = "id") {
  return (req, res, next) => {
    const id = parseInt(req.params[nomParam], 10);
    const jwtId = req.utilisateurJwt?.id_users;
    if (Number.isNaN(id) || jwtId == null || jwtId !== id) {
      return res.status(403).json({
        success: false,
        message: "Acces refuse.",
      });
    }
    next();
  };
}

/**
 * Après express.json(): le champ du corps doit être l'identifiant JWT (ex. users_id_users).
 * @param {string} champCorps
 */
export function exigerUtilisateurCorps(champCorps = "users_id_users") {
  return (req, res, next) => {
    const bodyId = Number(req.body?.[champCorps]);
    const jwtId = req.utilisateurJwt?.id_users;
    if (
      !Number.isFinite(bodyId) ||
      jwtId == null ||
      bodyId !== jwtId
    ) {
      return res.status(403).json({
        error: "Acces refuse.",
      });
    }
    next();
  };
}
