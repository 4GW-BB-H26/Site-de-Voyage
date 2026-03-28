import { useEffect, useState } from "react";

function currentHashKey() {
  const h = (window.location.hash || "#accueil").replace(/^#\/?/, "").toLowerCase();
  if (!h) return "accueil";
  return h;
}

/**
 * Barre décorative : aucun lien ne modifie l’URL.
 * Pour changer d’écran, modifiez manuellement le fragment (#accueil, #login, #inscription, #reservations).
 */
export default function BarreNavigation() {
  const [hashKey, setHashKey] = useState(currentHashKey);

  useEffect(() => {
    const onHash = () => setHashKey(currentHashKey());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const itemClass = (key) =>
    `menu-item menu-item-inactif${hashKey === key ? " menu-item-actif" : ""}`;

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

        <nav className="menu-navigation" aria-label="Menu (non cliquable)">
          <span className={itemClass("accueil")}>Recommandées</span>
          <span className={hashKey === "accueil" ? "menu-item menu-item-actif menu-item-inactif" : "menu-item menu-item-inactif"}>
            Offres
          </span>
          <span className="menu-item menu-item-inactif">Mes favoris</span>
          <span className={itemClass("reservations")}>Mes réservations</span>
          <span className={itemClass("login")}>Compte</span>
          <span className="menu-item menu-item-inactif">Support</span>
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
