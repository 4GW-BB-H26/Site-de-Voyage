/**
 * Configuration de la connexion Oracle
 */

export default {
  user: process.env.ORACLE_USER || "app_admin",
  password: process.env.ORACLE_PASSWORD || "oracle",
  connectString: process.env.ORACLE_CONNECT_STRING || "localhost:1521/XE"
};
