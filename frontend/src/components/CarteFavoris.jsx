import { BsHeartFill } from "react-icons/bs";

export default function CarteFavori({
  id,
  nomDestination,
  dateAjout,
  onRetirer,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="carte-favori">
      <div className="carte-favori-info">
        <h3 className="carte-favori-titre">{nomDestination}</h3>
        <p className="carte-favori-date">
          Ajouté le {formatDate(dateAjout)}
        </p>
      </div>

      <button
        className="btn-retirer-favori"
        onClick={() => onRetirer(id)}
        aria-label="Retirer des favoris"
      >
        <BsHeartFill /> Retirer
      </button>
    </article>
  );
}
