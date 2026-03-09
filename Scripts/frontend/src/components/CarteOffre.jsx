export default function CarteOffre({
  imageUrl,
  imageAlt,
  ville,
  dates,
  voyageurs,
  statut,
  typeStatut,
  prix,
}) {
  return (
    <article className="carte-offre">
      <img className="image-offre" src={imageUrl} alt={imageAlt} />

      <div className="contenu-offre">
        <div className="colonne-texte">
          <h3 className="titre-offre">{ville}</h3>
          <p className="destination-offre">{dates}</p>
          <p className="destination-offre">{voyageurs}</p>
          <span className={`badge-statut badge-${typeStatut}`}>{statut}</span>
        </div>

        <div className="colonne-actions">
          <p className="prix-offre">{prix}</p>
          <div className="boutons-offre">
            <button className="btn-offre btn-secondaire">Voir les détails</button>
            <button className="btn-offre btn-secondaire">Télécharger</button>
            <button className="btn-offre btn-danger">Annuler</button>
          </div>
        </div>
      </div>
    </article>
  );
}
