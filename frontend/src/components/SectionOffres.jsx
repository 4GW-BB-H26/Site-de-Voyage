import CarteOffrePromo from "./CarteOffrePromo";
import { filtrerOffres } from "../utils/filtrerOffres.js";

/**
 * @param {object} props
 * @param {string} props.titreSection
 * @param {object[]} props.offres
 * @param {boolean} props.loading
 * @param {string} props.error
 * @param {{ destination?: string; pays?: string; depart?: string; retour?: string; voyageurs?: number } | null} props.criteresRecherche
 */
export default function SectionOffres({ titreSection, offres, loading, error, criteresRecherche }) {
  const listeFiltree = filtrerOffres(offres, criteresRecherche);

  if (loading) {
    return (
      <section className="section-offres">
        <h2 className="titre-section">{titreSection}</h2>
        <p className="sous-titre-reservations">Chargement des offres...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-offres">
        <h2 className="titre-section">{titreSection}</h2>
        <p className="text-danger" role="alert">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="section-offres">
      <h2 className="titre-section">{titreSection}</h2>

      {criteresRecherche ? (
        <p className="text-muted small mb-3" role="status">
          {listeFiltree.length === 0
            ? "Aucune offre ne correspond à votre recherche ou au pays choisi. Essayez d’élargir les critères."
            : `${listeFiltree.length} offre${listeFiltree.length > 1 ? "s" : ""} correspond${listeFiltree.length > 1 ? "ent" : ""} à votre recherche${
                criteresRecherche.pays && criteresRecherche.pays !== "all" ? ` (${criteresRecherche.pays})` : ""
              }.`}
        </p>
      ) : null}

      <div className="grille-offres-promo">
        {listeFiltree.map((offre) => (
          <CarteOffrePromo key={offre.id} {...offre} />
        ))}
      </div>
    </section>
  );
}
