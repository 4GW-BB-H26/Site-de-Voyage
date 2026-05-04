// Formulaire de recherche de voyages (filtre les offres promotionnelles)
import { useState } from "react";
import { FiSearch, FiCalendar, FiUser } from "react-icons/fi";
import { validerRechercheVoyage } from "../utils/validator.js";

/**
 * @param {object} props
 * @param {string[]} [props.paysOptions]
 * @param {(criteres: object | null) => void} props.onChercher
 * @param {() => void} [props.onReinitialiser]
 */
export default function BarreRecherche({ paysOptions = [], onChercher, onReinitialiser }) {
  const [destination, setDestination] = useState("");
  const [depart, setDepart] = useState("");
  const [retour, setRetour] = useState("");
  const [voyageurs, setVoyageurs] = useState("1");
  const [pays, setPays] = useState("all");
  const [erreurRecherche, setErreurRecherche] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreurRecherche("");
    const v = validerRechercheVoyage({ destination, depart, retour, voyageurs, pays });
    if (!v.ok) {
      setErreurRecherche(v.message || "Formulaire invalide.");
      return;
    }
    onChercher?.({
      destination: v.destination,
      depart: v.depart,
      retour: v.retour,
      voyageurs: v.voyageurs,
      pays: v.pays,
    });
  };

  const handleReset = () => {
    setDestination("");
    setDepart("");
    setRetour("");
    setVoyageurs("1");
    setPays("all");
    setErreurRecherche("");
    onReinitialiser?.();
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
              placeholder="Rechercher (ville, pays, vol…)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Pays (filtre)</span>
          <select
            className="form-select champ-select-pays"
            aria-label="Filtrer par pays"
            value={pays}
            onChange={(e) => setPays(e.target.value)}
          >
            <option value="all">Tous les pays</option>
            {paysOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Date de départ</span>
          <div className="input-with-icon">
            <FiCalendar className="icone-champ" />
            <input type="date" value={depart} onChange={(e) => setDepart(e.target.value)} />
          </div>
        </div>
        <div className="champ-recherche-wrapper">
          <span className="label-champ">Date de retour</span>
          <div className="input-with-icon">
            <FiCalendar className="icone-champ" />
            <input type="date" value={retour} onChange={(e) => setRetour(e.target.value)} />
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
        <div className="d-flex flex-wrap gap-2 align-items-center w-100 justify-content-end">
          <button type="button" className="btn btn-outline-secondary bouton-reinitialiser" onClick={handleReset}>
            Réinitialiser
          </button>
          <button type="submit" className="bouton-chercher">
            Chercher
          </button>
        </div>
      </form>
    </section>
  );
}
