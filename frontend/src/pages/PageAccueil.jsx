import { useEffect, useState } from "react";
import BarreNavigation from "../components/BarreNavigation";
import BarreRecherche from "../components/BarreRecherche";
import SectionOffres from "../components/SectionOffres";
import SectionFooter from "../components/SectionFooter";
import { fetchAccueil } from "../api/accueil.js";

import "../styles/styles.css";

export default function PageAccueil() {
  const [titreSection, setTitreSection] = useState("Offres promotionnelles");
  const [offres, setOffres] = useState([]);
  const [paysFiltres, setPaysFiltres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [criteresRecherche, setCriteresRecherche] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAccueil();
        if (cancelled) return;
        setOffres(Array.isArray(data?.offres) ? data.offres : []);
        if (data?.titreSectionOffres) {
          setTitreSection(data.titreSectionOffres);
        }
        setPaysFiltres(Array.isArray(data?.paysFiltres) ? data.paysFiltres : []);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Erreur reseau.");
          setOffres([]);
          setPaysFiltres([]);
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

  return (
    <div className="conteneur_app min-vh-100">
      <BarreNavigation />
      <main className="container-fluid px-0">
        <div className="container-lg px-3 px-lg-0">
          <BarreRecherche
            paysOptions={paysFiltres}
            onChercher={setCriteresRecherche}
            onReinitialiser={() => setCriteresRecherche(null)}
          />
          <SectionOffres
            titreSection={titreSection}
            offres={offres}
            loading={loading}
            error={error}
            criteresRecherche={criteresRecherche}
          />
        </div>
      </main>
      <SectionFooter />
    </div>
  );
}
