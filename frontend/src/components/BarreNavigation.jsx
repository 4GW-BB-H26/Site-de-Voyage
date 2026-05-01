import { useEffect, useState } from "react";
import Login from "./Login";

function currentHashKey() {
  const h = (window.location.hash || "#accueil").replace(/^#\/?/, "").toLowerCase(); //recupere le hash
  if (!h) return "accueil";
  return h;
}

export default function BarreNavigation() {
  const [hashKey, setHashKey] = useState(currentHashKey);
  //verification de la connection de l'utilisateur
  const [isLogged, setIsLogged] = useState(
  sessionStorage.getItem("travelExpressUser") != null
);
  let boutonName = isLogged? "Deconnexion":"Se connecter"; //string sur le bouton depandant de la connection de l'utilisateur
  let link = isLogged? "/acceuil":"/login" //redirection dependant de la connexion du user

  useEffect(() => {
    const onHash = () => setHashKey(currentHashKey());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const itemClass = (key) =>
    `menu-item${hashKey === key ? " menu-item-actif" : ""}`;

  //fonction appelee lors du clique du bouton deconnexion
  const handleLogout = () => {
    if(!isLogged){
      window.location.hash = link;  
    }
    else{
      sessionStorage.removeItem("travelExpressUser");
      sessionStorage.removeItem("travelExpressToken");
      setIsLogged(false);
      window.location.reload(true); //force le reload pour mettre a jour la page et ses fonctions
    }
  };


  return (
    <header className="barre-navigation">
      <div className="zone-gauche-nav">
        <span className="logo-application">
          <span className="logo-icone">✈️</span>
          <span className="logo-texte">TRAVEL EXPRESS</span>
        </span>

        <nav className="menu-navigation" aria-label="Menu principal">
          <a className={itemClass("accueil")} href="/#/accueil">Offres</a>
          <a className={itemClass("favoris")} href="/#/favoris">Mes favoris</a>
          <a className={itemClass("reservations")} href="/#/reservations">Mes réservations</a>
          <a className={itemClass("login")} href="/#/login">Compte</a>
          <span className="menu-item menu-item-inactif">Support et commentaires</span>
        </nav>
      </div>

      <div className="zone-droite-nav">
        <button type="button" className="bouton-deconnexion" onClick={handleLogout}> {boutonName}</button>
      </div>
    </header>
  );
}
