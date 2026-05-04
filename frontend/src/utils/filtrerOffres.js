/**
 * Recherche textuelle et filtre par pays sur les offres d'accueil (champs API).
 */
export function normaliserRecherche(s) {
  if (s == null) return "";
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param {object[]} offres
 * @param {{ destination?: string; pays?: string } | null} criteres
 * @returns {object[]}
 */
export function filtrerOffres(offres, criteres) {
  if (!Array.isArray(offres)) return [];
  if (!criteres) return offres;

  const pays = criteres.pays != null ? String(criteres.pays).trim() : "";
  const q = normaliserRecherche(criteres.destination).trim();
  const mots = q.split(/\s+/).filter(Boolean);

  return offres.filter((o) => {
    if (pays && pays !== "all" && o.pays !== pays) return false;
    if (mots.length === 0) return true;
    const haystack = normaliserRecherche(
      [o.lieu, o.titre, o.pays, o.vol, o.imageAlt].filter(Boolean).join(" ")
    );
    return mots.every((w) => haystack.includes(w));
  });
}
