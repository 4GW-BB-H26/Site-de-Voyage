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
    window.location.hash = "#accueil";
  };

  return (
    <header className="barre-navigation">
      <div className="zone-gauche-nav">
        <a href="#accueil" className="logo-application text-decoration-none text-reset">
          <span className="logo-icone">✈️</span>
          <span className="logo-texte">TRAVEL EXPRESS</span>
        </a>

        <nav className="menu-navigation">
          <a href="#accueil" className="menu-item">
            Recommandées
          </a>
          <a
            href="#accueil"
            className={hashKey === "accueil" ? "menu-item menu-item-actif" : "menu-item"}
          >
            Offres
          </a>
          <span className="menu-item">Mes favoris</span>
          <a href="#reservations" className={itemClass("reservations")}>
            Mes réservations
          </a>
          <a href="#login" className={itemClass("login")}>
            Compte
          </a>
          <span className="menu-item">Support</span>
        </nav>
      </div>

      <div className="zone-droite-nav">
        <button type="button" className="bouton-deconnexion" onClick={handleLogout}>
          Se Déconnecter
        </button>

        <div className="zone-recherche-nav">
          <span className="icone-recherche"></span>
          <input
            type="text"
            placeholder="Rechercher un voyage"
            className="champ-recherche-nav"
          />
        </div>
      </div>
    </header>
  );
}
