import BarreNavigation from "./components/BarreNavigation";
import BarreRecherche from "./components/BarreRecherche";
import SectionOffres from "./components/SectionOffres";
import "./App.css";

function App() {
  return (
    <div className="conteneur_app">
      <BarreNavigation />
      <BarreRecherche />
      <SectionOffres />
    </div>
  );
}

export default App;