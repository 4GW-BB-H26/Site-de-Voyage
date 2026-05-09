import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";
import { ErreurApplicative } from "../utils/errors.js";

//validation des requetes user avec JWT

export function exigerJetonValide(req, res, next) {
  const header = req.headers.authorization;
  const match = header && header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return next(
      new ErreurApplicative(
        "Jeton d'authentification manquant ou en-tête Authorization incorrect.",
        {
          status: 401,
          code: "JETON_MANQUANT",
          recouvrement:
            "Ajoutez l'en-tête « Authorization: Bearer <jeton> » (jeton reçu à la connexion).",
        },
      ),
    );
  }
  try {
    const payload = jwt.verify(match[1], jwtSecret);
    const idBrut = payload.id_users ?? payload.sub;
    const id_users = Number(idBrut);
    if (!Number.isFinite(id_users)) {
      return next(
        new ErreurApplicative(
          "Jeton invalide : identifiant utilisateur absent ou incorrect.",
          {
            status: 401,
            code: "JETON_PAYLOAD",
            recouvrement:
              "Déconnectez-vous et reconnectez-vous pour obtenir un nouveau jeton.",
          },
        ),
      );
    }
    req.utilisateurJwt = {
      id_users,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch (err) {
    return next(err);
  }
}

export function exigerRessourceUtilisateur(nomParam = "id") {
  return (req, res, next) => {
    const id = parseInt(req.params[nomParam], 10);
    const jwtId = req.utilisateurJwt?.id_users;
    if (Number.isNaN(id) || jwtId == null || jwtId !== id) {
      return next(
        new ErreurApplicative("Accès refusé à cette ressource.", {
          status: 403,
          code: "ACCES_REFUSE",
          recouvrement:
            "Vous ne pouvez accéder qu'aux données associées à votre propre compte.",
        }),
      );
    }
    next();
  };
}

export function exigerUtilisateurCorps(champCorps = "users_id_users") {
  return (req, res, next) => {
    const bodyId = Number(req.body?.[champCorps]);
    const jwtId = req.utilisateurJwt?.id_users;
    if (!Number.isFinite(bodyId) || jwtId == null || bodyId !== jwtId) {
      return next(
        new ErreurApplicative(
          "Le corps de la requête ne correspond pas à l'utilisateur authentifié.",
          {
            status: 403,
            code: "CORPS_UTILISATEUR_INCOHERENT",
            recouvrement:
              "Le champ users_id_users (ou équivalent) doit être identique à votre identifiant dans le jeton.",
          },
        ),
      );
    }
    next();
  };
}
