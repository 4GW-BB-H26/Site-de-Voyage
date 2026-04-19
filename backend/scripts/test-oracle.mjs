/**
 * Petit script pour voir si Oracle accepte les identifiants du .env.
 * À lancer depuis le dossier backend : npm run test:oracle
 */
import "../src/config/loadEnv.js";
import oracledb from "oracledb";
import dbConfig from "../src/config/db.js";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

console.log("On essaie de se connecter avec :");
console.log("  utilisateur :", dbConfig.user);
console.log("  chaîne      :", dbConfig.connectString);
console.log("  longueur du mot de passe :", String(dbConfig.password ?? "").length);

let conn;
try {
  // Connexion “minimale” : si ça passe, le user/mdp/service sont cohérents
  conn = await oracledb.getConnection(dbConfig);
  const r = await conn.execute(
    "SELECT USER AS u, SYS_CONTEXT('USERENV','SERVICE_NAME') AS svc FROM dual"
  );
  console.log("\nÇa marche — tu es bien connecté.");
  console.log("  utilisateur Oracle :", r.rows?.[0]?.U ?? r.rows?.[0]);
  console.log("  nom de service     :", r.rows?.[0]?.SVC ?? r.rows?.[0]);
} catch (err) {
  // 1017 = mauvais login ; 12xxx = souvent réseau / service inconnu
  console.error("\nConnexion refusée :");
  console.error("  code Oracle :", err.errorNum);
  console.error("  détail      :", err.message);
  if (err.errorNum === 1017) {
    console.error(
      "\nORA-01017 = mauvais couple utilisateur / mot de passe pour ce service.\n" +
        "  • Vérifie le nom de service (lsnrctl services) — il doit coller à ORACLE_CONNECT_STRING.\n" +
        "  • Connecte-toi en SYS AS SYSDBA sur ce service et lance scripts/ensure_oracle_user.sql\n" +
        "  • Le pas-à-pas est dans scripts/ORACLE_SETUP.txt\n"
    );
  }
  if (err.errorNum === 12154 || err.errorNum === 12541) {
    console.error(
      "\nOracle n’écoute pas ce service (ou pas au bon endroit).\n" +
        "  • Contrôle ORACLE_CONNECT_STRING (FREEPDB1 vs XEPDB1, etc.)\n" +
        "  • Sous Windows, vérifie que le service Oracle est démarré.\n"
    );
  }
  process.exitCode = 1;
} finally {
  if (conn) {
    try {
      await conn.close();
    } catch {
      /* on ignore une erreur à la fermeture */
    }
  }
}
