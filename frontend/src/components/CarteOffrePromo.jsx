// Carte d'une offre Hôtel + Vol (promotions)
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";

export default function CarteOffrePromo({
  id,
  imageUrl,
  imageAlt,
  titre,
  lieu,
  note,
  vol,
  dates,
  prix,
  ancienPrix,
}) {
  const [estFavori, setEstFavori] = useState(false);

  const toggleFavori = (e) => {
    e.stopPropagation();
    setEstFavori(!estFavori);
  };

  const handleReserver = (e) => {
    e.stopPropagation();
    alert(`Réservation pour : ${titre} - ${lieu}`);
  };

  return (
    <article className="carte-offre-promo">
      <div className="carte-promo-image">
        <img src={imageUrl} alt={imageAlt} />
        <button
          type="button"
          className={`btn-favori ${estFavori ? "favori-actif" : ""}`}
          aria-label={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={toggleFavori}
        >
          {estFavori ? <BsHeartFill /> : <FiHeart />}
        </button>
      </div>
      <div className="carte-promo-contenu">
        <h3 className="carte-promo-titre">{titre}</h3>
        <p className="carte-promo-lieu">{lieu}</p>
        <p className="carte-promo-note">{note}</p>
        <p className="carte-promo-vol">{vol}</p>
        <p className="carte-promo-dates">{dates}</p>
        <div className="carte-promo-prix">
          <span className="prix-actuel">{prix}</span>
          {ancienPrix && <span className="prix-ancien">{ancienPrix}</span>}
        </div>
        <button type="button" className="btn-reserver" onClick={handleReserver}>
          Réserver
        </button>
      </div>
    </article>
  );
}
