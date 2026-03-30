import { OFFRES_PROMO, TITRE_SECTION_OFFRES } from "../data/offresAccueil.js";

export function getAccueil(req, res) {
  res.json({
    titreSectionOffres: TITRE_SECTION_OFFRES,
    offres: OFFRES_PROMO,
  });
}
