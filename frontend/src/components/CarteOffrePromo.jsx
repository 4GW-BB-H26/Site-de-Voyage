// Carte d'une offre Hôtel + Vol (promotions)
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import InfosPays from "./InfosPays";

export default function CarteOffrePromo({
  imageUrl,
  imageAlt,
  titre,
  lieu,
  note,
  vol,
  dates,
  pays,
  prix,
  ancienPrix,
}) {
  //verfication de s'il est un favorit
  const [estFavori, setEstFavori] = useState(false);
  //verification de si le user est connecter
  const [isLogged, setLogged] = useState(
  sessionStorage.getItem("travelExpressToken") !== null
);
  let link = isLogged? "/acceuil":"/login"
  const [afficherDetails, setAfficherDetails] = useState(false);

  //logic du bouton favori
  const toggleFavori = (e) => {
    if(isLogged){
      e.stopPropagation();
    setEstFavori(!estFavori);
    }
    else{
      window.location.hash = link;
    }
  };

  //logic du bouton reserver
  const handleReserver = (e) => {
    if(isLogged){
      e.stopPropagation();
    alert(`Réservation pour : ${titre} - ${lieu}`);
    }else if(!isLogged){
      window.location.hash = link;
    }
  };

  //logique du bouton voir info du pays
  const toggleDetails = () => {
    setAfficherDetails(!afficherDetails);
  };

  return (
    <article 
      className="carte-offre-promo" 
      onClick={toggleDetails}
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
    >
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

        <p style={{ color: "#007bff", fontSize: "0.85em", marginTop: "10px", fontWeight: "bold" }}>
          {afficherDetails ? "Masquer les infos du pays" : "Cliquer pour les infos du pays"}
        </p>
        {afficherDetails && pays && <InfosPays nomPays={pays} />}

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