import BarreNavigation from "../components/BarreNavigation";
import SectionFavoris from "../components/SectionFavoris";
import SectionFooter from "../components/SectionFooter";

import "../styles/styles.css";

/* ajout des composants pour la page de favoris*/
export default function FavorisPage() {
  return (
    <div className="conteneur_app min-vh-100">
      <BarreNavigation />
      <main className="container-fluid px-0">
        <div className="container-lg px-3 px-lg-0">
          <SectionFavoris />
        </div>
      </main>
      <SectionFooter />
    </div>
  );
}
