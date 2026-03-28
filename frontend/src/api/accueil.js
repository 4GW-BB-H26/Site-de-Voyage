import { API_BASE } from "./client.js";

/**
 * @returns {Promise<{ titreSectionOffres: string; offres: object[] }>}
 */
export async function fetchAccueil() {
  const res = await fetch(`${API_BASE}/accueil`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      data && typeof data.error === "string"
        ? data.error
        : "Impossible de charger la page d'accueil.";
    throw new Error(msg);
  }
  return data;
}
