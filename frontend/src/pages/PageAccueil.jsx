import BarreNavigation from "../components/BarreNavigation";
import BarreRecherche from "../components/BarreRecherche";
import SectionOffres from "../components/SectionOffres";
import SectionFooter from "../components/SectionFooter";

import "../styles/styles.css";

/* ajout des composants pour la page d'acceuil*/
export default function PageAccueil() {
  return (
    <div className="conteneur_app min-vh-100">
      {/* Barre de navigation principale (composant BarreNavigation) */}
      <BarreNavigation />
      <main className="container-fluid px-0">
        <div className="container-lg px-3 px-lg-0">
          {/* Barre de recherche des offres (composant BarreRecherche) */}
          <BarreRecherche />
          {/* Section listant les offres via les cartes CarteOffre (composant SectionOffres) */}
          <SectionOffres />
        </div>
      </main>
      {/* Pied de page de l'application (composant SectionFooter) */}
      <SectionFooter />
    </div>
  );
}
