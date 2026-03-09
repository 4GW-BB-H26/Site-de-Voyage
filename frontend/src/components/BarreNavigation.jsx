export default function BarreNavigation() {
  return (
    <header className="barre-navigation">
      <div className="zone-gauche-nav">
        <div className="logo-application">
          {/*l'icone ✈️  est un emoji de l'avion prise de https://emojipedia.org/airplane */}
          <span className="logo-icone">✈️</span>
          <span className="logo-texte">TRAVEL EXPRESS</span>
        </div>

        <nav className="menu-navigation">
          <span className="menu-item">Recommandées</span>
          <span className="menu-item">Offres</span>
          <span className="menu-item">Mes favoris</span>
          <span className="menu-item menu-item-actif">Mes réservations</span>
          <span className="menu-item">Compte</span>
          <span className="menu-item">Support</span>
        </nav>
      </div>

      <div className="zone-droite-nav">
        <button className="bouton-deconnexion">Se Déconnecter</button>

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