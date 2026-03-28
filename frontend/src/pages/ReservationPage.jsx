import BarreNavigation from "../components/BarreNavigation";
import SectionReservation from "../components/SectionReservation";
import SectionFooter from "../components/SectionFooter";

import "../styles/styles.css";

export default function ReservationPage() {
  return (
    <div className="conteneur_app min-vh-100">
      <BarreNavigation />
      <main className="container-fluid px-0">
        <div className="container-lg px-3 px-lg-0">
          <SectionReservation />
        </div>
      </main>
      <SectionFooter />
    </div>
  );
}
