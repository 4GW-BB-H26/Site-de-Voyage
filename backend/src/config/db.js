/**
 * Paramètres pour se brancher sur Oracle.
 * Petit trim() sur user / mot de passe : un espace en trop dans le .env
 * suffit à provoquer un ORA-01017 alors que tout est bon sur le papier.
 */

/** Lit une variable d’environnement ; si vide ou absente, on prend la valeur par défaut */
function envTrim(key, fallback) {
  const v = process.env[key];
  if (v == null || String(v).trim() === "") return fallback;
  return String(v).trim();
}

export default {
  user: envTrim("ORACLE_USER", "ProjetVoyage"),
  password: envTrim("ORACLE_PASSWORD", "cisco"),
  connectString: envTrim(
    "ORACLE_CONNECT_STRING",
    "localhost:1521/FREEPDB1"
  ),
};
