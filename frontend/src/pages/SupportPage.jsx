import BarreNavigation from "../components/BarreNavigation";
import SectionSupport from "../components/SectionSupport";
import SectionFooter from "../components/SectionFooter";

import "../styles/styles.css";

export default function SupportPage() {
  return (
    <div className="conteneur_app">
      <BarreNavigation />
      <main className="container-fluid px-0">
        <div className="container-lg px-3 px-lg-0">
          <SectionSupport />
        </div>
      </main>
      <SectionFooter />
    </div>
  );
}
