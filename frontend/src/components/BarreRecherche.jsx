// Formulaire de recherche de voyages
import { useState } from "react";
import { FiSearch, FiCalendar, FiUser } from "react-icons/fi";

export default function BarreRecherche() {
  const [type, setType] = useState("voyage");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Recherche lancée (${type === "voyage" ? "Voyage" : "Voiture"})`);
  };

  return (
    <section className="barre-recherche">
      <form className="formulaire-recherche" onSubmit={handleSubmit}>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Où allons nous?</span>
          <div className="input-with-icon">
            <FiSearch className="icone-champ" />
            <input type="text" placeholder="Rechercher" />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Date de départ</span>
          <div className="input-with-icon">
            <FiCalendar className="icone-champ" />
            <input type="date" placeholder="Date de départ" />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Date de retour</span>
          <div className="input-with-icon">
            <FiCalendar className="icone-champ" />
            <input type="date" placeholder="Date de retour" />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Voyageurs</span>
          <div className="input-with-icon">
            <FiUser className="icone-champ" />
            <input type="text" placeholder="Rechercher" />
          </div>
        </div>
        <button type="submit" className="bouton-chercher">
          Chercher
        </button>
      </form>

      <div className="options-supplementaires radio-group">
        <label className="radio-option">
          <input
            type="radio"
            name="type"
            checked={type === "voyage"}
            onChange={() => setType("voyage")}
          />
          Ajouter un Voyage
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="type"
            checked={type === "voiture"}
            onChange={() => setType("voiture")}
          />
          Ajouter une Voiture
        </label>
      </div>
    </section>
  );
}
