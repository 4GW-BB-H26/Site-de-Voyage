import BarreNavigation from "../components/BarreNavigation";
import BarreRecherche from "../components/BarreRecherche";
import SectionOffres from "../components/SectionOffres";
import SectionFooter from "../components/SectionFooter";
import "../styles/styles.css";

export default function PageAccueil() {
  return (
    <div className="conteneur_app min-vh-100">
      <BarreNavigation />
      <main className="container-fluid px-0">
        <div className="container-lg px-3 px-lg-0">
          <BarreRecherche />
          <SectionOffres />
        </div>
      </main>
      <SectionFooter />
    </div>
  );
}
