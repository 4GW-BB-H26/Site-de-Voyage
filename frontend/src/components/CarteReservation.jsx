import { FiEye, FiDownload, FiX } from "react-icons/fi";

const classeStatut = (statut) => {
    if (statut === "Validée") return "badge-validee";
    if (statut === "À venir") return "badge-a-venir";
    if (statut === "Annulée") return "badge-annulee";
    return "";
};

export default function CarteReservation({
    imageUrl,
    imageAlt,
    ville,
    dates,
    voyageurs,
    statut,
    prix,
})  {
    return (
        <article className="carte-reservation">
            <img className="carte-reservation-image" src={imageUrl} alt={imageAlt}/>

            <div className="carte-reservation-contenu">
                <div className="carte-reservation-info">
                    <h3 className="carte-reservation-titre">{ville}</h3>
                    <p className="carte-reservation-dates">{dates}</p>
                    <p className="carte-reservation-voyageurs">{voyageurs}</p>
                    <div className="carte-reservation-bas">
                        <span className={`badge-statut ${classeStatut(statut)}`}>{statut}</span>
                        <span className="carte-reservation-prix">{prix}</span>
                        </div>
                </div>
            </div>

            <div className="carte-reservation-actions">
                <button className="btn-action-reservation"> <FiEye/> Voir les détails</button>
                <button className="btn-action-reservation"> <FiDownload/> Télécharger</button>
                <button className="btn-action-reservation btn-action-annuler"> <FiX/> Annuler </button>
            </div>
        </article>
    ) ;
}