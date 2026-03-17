/**
 * Configuration de la connexion Oracle
 */

export default {
  user: process.env.ORACLE_USER || "ProjetVoyage",
  password: process.env.ORACLE_PASSWORD || "cisco",
  connectString: process.env.ORACLE_CONNECT_STRING || "localhost:1521"
};
