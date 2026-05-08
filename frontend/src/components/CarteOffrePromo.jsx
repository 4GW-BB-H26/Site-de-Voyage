// Carte d'une offre Hôtel + Vol (promotions)
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import InfosPays from "./InfosPays";
import { addFavoris, removeFavoris } from "../api/favoris.js";
import { addReservationForUser } from "../api/reservations.js";

function lireUtilisateurSession() {
  const raw = sessionStorage.getItem("travelExpressUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function CarteOffrePromo({
  id,
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
  id_trip
}) {
  //verfication de s'il est un favorit
  const [estFavori, setEstFavori] = useState(false);
  const [favoriId, setFavoriId] = useState(null);
  const [afficherDetails, setAfficherDetails] = useState(false);

  const toggleFavori = async (e) => {
    e.stopPropagation();
    const user = lireUtilisateurSession();

    try {
      if (!estFavori) {
        const res = await addFavoris({
          userId: String(user.id_users),
          destinationId: String(id),
          nomDestination: lieu,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = data && typeof data.error === "string" ? data.error : "Impossible d’ajouter le favori.";
          alert(msg);
          return;
        }
        const fid = data?._id != null ? String(data._id) : null;
        if (fid) {
          setFavoriId(fid);
          setEstFavori(true);
        }
      } else if (favoriId) {
        const del = await removeFavoris(favoriId);
        if (!del.ok) {
          alert("Impossible de retirer le favori.");
          return;
        }
        setFavoriId(null);
        setEstFavori(false);
      }
    } catch {
      alert("Erreur lors de la mise à jour des favoris.");
    }
  };

  const handleReserver = async (e) => {
    e.stopPropagation();
    const user = lireUtilisateurSession();
    if (user?.id_users) {
      try{
        const [startRaw, endRaw] = dates.split(" - "); //pour separer les dates

        console.log(startRaw+ " et "+endRaw);

        const body = {
          reference_number: Date.now(),
          date_start: startRaw,
          date_end: endRaw,
          nb_travelers: 1, //hard coded car on ne peut pas inserer un nombre de voyageurs
          price: prix,
          status: "En attente",
        };

        const res = await addReservationForUser(
          user.id_users,
          body,
          id_trip
        );

        console.log(res);

        // if(!res.ok){
        //   alert(data.error || "Impossible de prendre une reservation");
        //   return;
        // }
        // alert("Réservation prise !");
      
      }catch(err){
        console.error(err);
        alert(err);
        return;
      }
      alert(`Réservation pour : ${titre} - ${lieu}`);

    } else {
      window.location.hash = "#/login";
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
          <span className="prix-actuel">CAD ${prix}</span>
          {ancienPrix && <span className="prix-ancien">{ancienPrix}</span>}
        </div>
        <button type="button" className="btn-reserver" onClick={handleReserver}>
          Réserver
        </button>
      </div>
    </article>
  );
}