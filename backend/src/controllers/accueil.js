import { OFFRES_PROMO, TITRE_SECTION_OFFRES } from "../data/offresAccueil.js";

export function getAccueil(req, res) {
  const paysFiltres = [...new Set(OFFRES_PROMO.map((o) => o.pays).filter(Boolean))].sort();
  res.json({
    titreSectionOffres: TITRE_SECTION_OFFRES,
    paysFiltres,
    offres: OFFRES_PROMO,
  });
}
