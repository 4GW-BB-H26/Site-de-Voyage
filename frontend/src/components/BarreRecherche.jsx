// Formulaire de recherche de voyages
import { useState } from "react";
import { FiSearch, FiCalendar, FiUser } from "react-icons/fi";
import { validerRechercheVoyage } from "../utils/validator.js";

export default function BarreRecherche() {
  const [type, setType] = useState("voyage");
  const [destination, setDestination] = useState("");
  const [depart, setDepart] = useState("");
  const [retour, setRetour] = useState("");
  const [voyageurs, setVoyageurs] = useState("1");
  const [erreurRecherche, setErreurRecherche] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreurRecherche("");
    const v = validerRechercheVoyage({ destination, depart, retour, voyageurs });
    if (!v.ok) {
      setErreurRecherche(v.message || "Formulaire invalide.");
      return;
    }
    alert(`Recherche lancée (${type === "voyage" ? "Voyage" : "Voiture"})`);
  };

  return (
    <section className="barre-recherche">
      <form className="formulaire-recherche" onSubmit={handleSubmit}>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Où allons nous?</span>
          <div className="input-with-icon">
            <FiSearch className="icone-champ" />
            <input
              type="text"
              placeholder="Rechercher"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Date de départ</span>
          <div className="input-with-icon">
            <FiCalendar className="icone-champ" />
            <input
              type="date"
              placeholder="Date de départ"
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
            />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Date de retour</span>
          <div className="input-with-icon">
            <FiCalendar className="icone-champ" />
            <input
              type="date"
              placeholder="Date de retour"
              value={retour}
              onChange={(e) => setRetour(e.target.value)}
            />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Voyageurs</span>
          <div className="input-with-icon">
            <FiUser className="icone-champ" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Nombre de voyageurs"
              value={voyageurs}
              onChange={(e) => setVoyageurs(e.target.value)}
            />
          </div>
        </div>
        {erreurRecherche ? (
          <p className="text-danger small px-1" role="alert">
            {erreurRecherche}
          </p>
        ) : null}
        <button type="submit" className="bouton-chercher">
          Chercher
        </button>
      </form>
    </section>
  );
}
