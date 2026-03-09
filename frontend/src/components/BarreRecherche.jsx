export default function BarreRecherche() {
  return (
    <section className="barre-recherche">
      <form className="formulaire-recherche">
        <input
          type="text"
          className="champ-recherche"
          placeholder="Destination, ville ou pays"
        />
        <input
          type="date"
          className="champ-recherche"
          placeholder="Date de départ"
        />
        <input
          type="date"
          className="champ-recherche"
          placeholder="Date de retour"
        />
        <input
          type="number"
          min="1"
          className="champ-recherche"
          placeholder="Voyageurs"
        />
        <button type="submit" className="bouton-rechercher">
          Rechercher
        </button>
      </form>

      <div className="options-supplementaires">
        <label>
          <input type="checkbox" /> Vol direct seulement
        </label>
        <label>
          <input type="checkbox" /> Inclure les hotels
        </label>
        <label>
          <input type="checkbox" /> Utiliser mes préférences
        </label>
      </div>
    </section>
  );
}
