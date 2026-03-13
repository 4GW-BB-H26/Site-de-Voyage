import React, { useState } from "react";
import "../styles/styles.css";

export default function Inscription() {
const [formulaire, setFormulaire] = useState({
    nom: "",
    prenom: "",
    courriel: "",
    motDePasse: "",
    confirmation: "",
    accepteConditions: false,
  });
  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulaire({
      ...formulaire,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const gererSubmit = (e) => {
    e.preventDefault();
    console.log("Données capturées :", formulaire);
    alert("Normalement ca foncitonne");
  };
  return (
    <div className="conteneur-inscription"><div className="boite-inscription">
        <h1 className="titre-inscription">Créer un compte</h1>
        <p className="sous-titre-inscription">Insrivez-vous à Travel Express</p>

        <form className="formulaire-inscription" onSubmit={gererSubmit}>
          
          <div className="groupe-ligne">
            <div className="groupe-champ">
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formulaire.nom}
                onChange={gererChangement}
                className="champ-saisie"
              />
            </div>

            <div className="groupe-champ">
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formulaire.prenom}
                onChange={gererChangement}
                className="champ-saisie"
              />
            </div>
          </div>

          <div className="groupe-champ">
            <input
              type="email"
              name="courriel"
              placeholder="Adresse courriel"
              value={formulaire.courriel}
              onChange={gererChangement}
              className="champ-saisie"
            />
          </div>

          <div className="groupe-champ">
            <input
              type="password"
              name="motDePasse"
              placeholder="Mot de passe"
              value={formulaire.motDePasse}
              onChange={gererChangement}
              className="champ-saisie"
            />
          </div>

          <div className="groupe-champ">
            <input
              type="password"
              name="confirmation"
              placeholder="Confirmer le mot de passe"
              value={formulaire.confirmation}
              onChange={gererChangement}
              className="champ-saisie"
            />
          </div>

          <div className="groupe-champ">
            <div className="groupe-conditions">
              <input
                type="checkbox"
                name="accepteConditions"
                id="checkbox-conditions"
                checked={formulaire.accepteConditions}
                onChange={gererChangement}
              />
              <label htmlFor="checkbox-conditions" className="texte-conditions">
                J'ai lu et j'accepte les <a href="#" className="lien-conditions">conditions d'utilisations</a>
              </label>
            </div>
          </div>

          <button type="submit" className="bouton-inscription">
            S'inscrire
          </button>

        </form>

        <div className="zone-connexion">
          Vous avez déjà un compte? 
          <a href="#" className="lien-connexion">Se connecter</a>
        </div>
      </div>
    </div>
  );
}