import { useEffect, useState } from "react";
import CarteOffrePromo from "./CarteOffrePromo";
import { fetchAccueil } from "../api/accueil.js";

export default function SectionOffres() {
  const [titreSection, setTitreSection] = useState("Offres promotionnelles");
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAccueil();
        if (cancelled) return;
        const list = Array.isArray(data?.offres) ? data.offres : [];
        setOffres(list);
        if (data?.titreSectionOffres) {
          setTitreSection(data.titreSectionOffres);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Erreur reseau.");
          setOffres([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

      <div className="grille-offres-promo">
        {offres.map((offre) => (
          <CarteOffrePromo key={offre.id} {...offre} />
        ))}
      </div>
    </section>
  );
}
