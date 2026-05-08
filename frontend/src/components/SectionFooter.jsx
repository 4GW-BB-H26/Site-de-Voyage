// Pied de page de l'application
export default function SectionFooter() {
  return (
    <footer className="section-footer">
      <div className="footer-contenu">
        <div className="footer-colonne footer-marque">
          <div className="logo-application footer-logo">
            
            {/*l'icone ✈️  est un emoji de l'avion pris sur https://emojipedia.org/airplane */}
            <span className="logo-icone">✈️</span>
            <span className="logo-texte">TRAVEL EXPRESS</span>
          </div>
          <p className="footer-texte">
            Gérez facilement toutes vos réservations de voyage au même endroit.
          </p>
        </div>

        <div className="footer-colonne">
          <h4 className="footer-titre">Support</h4>
          <ul className="footer-liste">
            <li>Centre d'aide</li>
            <li>Contact</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div className="footer-colonne">
          <h4 className="footer-titre">Légal</h4>
          <ul className="footer-liste">
            <li>Conditions d'utilisation</li>
            <li>Politique de confidentialité</li>
          </ul>
        </div>
      </div>

      <div className="footer-bas">
        <span>
          @ {new Date().getFullYear()} Travel Express. Tous droits réservés.
        </span>
      </div>
    </footer>
  );
}
