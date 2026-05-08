 //Params pour se brancher sur Oracle.


// Pour prendre valeur par défaut
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
