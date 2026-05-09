import { ErreurApplicative } from "../utils/errors.js";

//gestion des erreurs

const prod = process.env.NODE_ENV === "production";

/** Enveloppe un contrôleur async : rejets et `next(err)` sont gérés centralement. */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route introuvable : ${req.method} ${req.originalUrl}`,
    code: "ROUTE_INTROUVABLE",
    recouvrement:
      "Consultez la documentation des routes via GET / sur cette API.",
  });
}

function analyserErreurMongo(err) {
  if (err.name === "MongoNetworkError" || err.code === "ENOTFOUND") {
    return {
      status: 503,
      message: "Service MongoDB temporairement indisponible.",
      code: "MONGO_RESEAU",
      recouvrement:
        "Vérifiez que MongoDB est démarré (Docker ou service local) et que MONGODB_URI est correct, puis réessayez.",
    };
  }
  if (err.code === 11000) {
    return {
      status: 409,
      message: "Conflit : cette donnée existe déjà (doublon).",
      code: "MONGO_DOUBLON",
      recouvrement:
        "Modifiez les champs uniques ou supprimez l’entrée existante.",
    };
  }
  return null;
}

/**
 * @param {Error & { errorNum?: number; code?: string }} err
 */
function analyserErreurOracle(err) {
  const num = err.errorNum;
  const msg = String(err.message || "");

  if (
    num === 12170 ||
    num === 12541 ||
    num === 12543 ||
    msg.includes("ORA-12170") ||
    msg.includes("ORA-12541") ||
    msg.includes("TNS")
  ) {
    return {
      status: 503,
      message: "Base Oracle injoignable ou écoute fermée.",
      code: "ORACLE_CONNEXION",
      recouvrement:
        "Vérifiez qu’Oracle est démarré, que ORACLE_CONNECT_STRING est correct et que le réseau/firewall autorise le port, puis réessayez.",
    };
  }

  if (num === 1017 || msg.includes("ORA-01017")) {
    return {
      status: 503,
      message: "Identifiants Oracle refusés.",
      code: "ORACLE_AUTH",
      recouvrement:
        "Vérifiez ORACLE_USER et ORACLE_PASSWORD dans le fichier .env.",
    };
  }

  if (num === 942 || msg.includes("ORA-00942")) {
    return {
      status: 500,
      message: "Objet base de données introuvable (table ou vue).",
      code: "ORACLE_OBJET_MANQUANT",
      recouvrement:
        "Exécutez les scripts SQL de création du schéma sur la base Oracle.",
    };
  }

  return null;
}

function analyserErreurJwt(err) {
  if (err.name === "JsonWebTokenError") {
    return {
      status: 401,
      message: "Jeton d’authentification invalide.",
      code: "JETON_INVALIDE",
      recouvrement:
        "Déconnectez-vous et reconnectez-vous pour obtenir un nouveau jeton.",
    };
  }
  if (err.name === "TokenExpiredError") {
    return {
      status: 401,
      message: "Jeton d’authentification expiré.",
      code: "JETON_EXPIRE",
      recouvrement: "Reconnectez-vous pour obtenir un nouveau jeton.",
    };
  }
  return null;
}

function corpsErreurJsonParse(err) {
  if (err instanceof SyntaxError && "body" in err && err.status === 400) {
    return {
      status: 400,
      message: "Corps de la requête JSON invalide.",
      code: "JSON_INVALIDE",
      recouvrement:
        "Vérifiez la syntaxe JSON (guillemets, virgules) et l’en-tête Content-Type: application/json.",
    };
  }
  if (err.type === "entity.parse.failed") {
    return {
      status: 400,
      message: "Impossible d’analyser le JSON du corps de la requête.",
      code: "JSON_PARSE",
      recouvrement:
        "Corrigez le format JSON ou envoyez un corps vide si la route ne l’exige pas.",
    };
  }
  return null;
}

export function errorHandler(err, req, res, _next) {
  if (res.headersSent) {
    console.error("Erreur après envoi des en-têtes :", err);
    return;
  }

  if (err instanceof ErreurApplicative) {
    return res.status(err.status).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(err.recouvrement ? { recouvrement: err.recouvrement } : {}),
    });
  }

  let status = 500;
  let message = "Erreur interne du serveur.";
  let code = "ERREUR_INTERNE";
  let recouvrement =
    "Si le problème persiste, contactez l’administrateur ou réessayez plus tard.";

  const mongo = analyserErreurMongo(err);
  const oracle = analyserErreurOracle(err);
  const jwt = analyserErreurJwt(err);
  const json = corpsErreurJsonParse(err);

  if (mongo) {
    ({ status, message, code, recouvrement } = mongo);
  } else if (oracle) {
    ({ status, message, code, recouvrement } = oracle);
  } else if (jwt) {
    ({ status, message, code, recouvrement } = jwt);
  } else if (json) {
    ({ status, message, code, recouvrement } = json);
  } else {
    console.error("[Erreur non gérée]", err);
    if (!prod && err.message) {
      message = err.message;
    }
  }

  const corps = {
    success: false,
    error: message,
    code,
    recouvrement,
  };

  if (!prod && err.stack) {
    corps.detail = err.stack.split("\n").slice(0, 5).join("\n");
  }

  res.status(status).json(corps);
}
