import { useEffect, useState } from "react";

function currentHashKey() {
  const h = (window.location.hash || "#accueil").replace(/^#\/?/, "").toLowerCase();
  if (!h) return "accueil";
  return h;
}

export default function BarreNavigation() {
  const [hashKey, setHashKey] = useState(currentHashKey);

  useEffect(() => {
    const onHash = () => setHashKey(currentHashKey());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const itemClass = (key) =>
    `menu-item${hashKey === key ? " menu-item-actif" : ""}`;

  const handleLogout = () => {
    sessionStorage.removeItem("travelExpressUser");
  };

  return (
    <header className="barre-navigation">
      <div className="zone-gauche-nav">
        <span className="logo-application">
          <span className="logo-icone">✈️</span>
          <span className="logo-texte">TRAVEL EXPRESS</span>
        </span>

        <nav className="menu-navigation" aria-label="Navigation principale">
          <a className={`lien-menu ${itemClass("accueil")}`} href="#accueil">Recommandées</a>
          <a className={`lien-menu ${itemClass("accueil")}`} href="#accueil">Offres</a>
          <a className={`lien-menu ${itemClass("favoris")}`} href="#favoris">Mes favoris</a>
          <a className={`lien-menu ${itemClass("reservations")}`} href="#reservations">Mes réservations</a>
          <a className={`lien-menu ${itemClass("login")}`} href="#login">Compte</a>
          <a className={`lien-menu ${itemClass("support")}`} href="#support">Support</a>
        </nav>
      </div>

      <div className="zone-droite-nav">
        <button
          type="button"
          className="bouton-deconnexion"
          onClick={handleLogout}
        >
          <a href="#login">Déconnexion</a>
        </button>

        <div className="zone-recherche-nav">
          <span className="icone-recherche"></span>
          <input
            type="text"
            placeholder="Rechercher une offre"
            className="champ-recherche-nav"
          />
        </div>
      </div>
    </header>
  );
}
