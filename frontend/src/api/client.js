export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const CLE_JETON = "travelExpressToken";

/** En-têtes Authorization si un jeton est présent dans sessionStorage */
export function entetesAvecJeton() {
  const jeton = sessionStorage.getItem(CLE_JETON);
  return jeton ? { Authorization: `Bearer ${jeton}` } : {};
}
