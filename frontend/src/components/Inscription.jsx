//Très inspiré de l'exercice 3 fourni par Mme Rim Mseddi 
import React, { useState, useRef } from "react";
import "../styles/styles.css";

export default function Inscription() {
  const [formulaire, setFormulaire] = useState({
    nom: "",
    prenom: "",
    username: "",
    courriel: "",
    motDePasse: "",
    confirmation: "",
    accepteConditions: false,
  });

  const [errorPersonal, setErrorPersonal] = useState("");
  const [errorConditions, setErrorConditions] = useState("");
  const [validationText, setValidationText] = useState("");
  const [Submitted, setSubmitted] = useState(false); 
  const formRef = useRef(null);

  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulaire({
      ...formulaire,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const test = () => {
    setSubmitted(true); 

    var personal = true;
    const form = formRef.current;
    
    const elements = form.elements;

    if (
      !elements['nom'].checkValidity() ||
      !elements['prenom'].checkValidity() ||
      !elements['username'].checkValidity() ||
      !elements['courriel'].checkValidity() ||
      !elements['motDePasse'].checkValidity() ||
      !elements['confirmation'].checkValidity()
    ) {
      setErrorPersonal("Veuillez remplir les champs de façon appropriée SVP");
      personal = false;
    } else {
      setErrorPersonal("");
    }

    var conditions = true;
    if (!formulaire.accepteConditions) {
      setErrorConditions("Veuillez accepter les conditions d'utilisation");
      conditions = false;
    } else {
      setErrorConditions("");
    }

    if (personal && conditions) {
      var validation = "Bonjour " + formulaire.prenom + " " + formulaire.nom;
      validation += ", nous vous répondrons par courriel au " + formulaire.courriel;
      validation += " (Pseudo choisi : " + formulaire.username + ")";

      setValidationText(validation);
    } else {
      setValidationText("");
    }
  };

  return (
    <div className="conteneur-inscription">
      
      <div className="boite-inscription">
        <h1 className="titre-inscription">Créer un compte</h1>
        <p className="sous-titre-inscription">Inscrivez-vous à Travel Express</p>
        <form 
          className={`formulaire-inscription ${Submitted ? "form-soumis" : ""}`} 
          ref={formRef}
        >
          
          <div className="groupe-ligne">
            <div className="groupe-champ">
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formulaire.nom}
                onChange={gererChangement}
                className="champ-saisie"
                required
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
                required
              />
            </div>
          </div>

          <div className="groupe-champ">
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formulaire.username}
              onChange={gererChangement}
              className="champ-saisie"
              required
            />
          </div>
          <div className="groupe-champ">
            <input
              type="email"
              name="courriel"
              placeholder="Adresse courriel"
              value={formulaire.courriel}
              onChange={gererChangement}
              className="champ-saisie"
              required
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
              required
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
              required
            />
          </div>
          <div id="errorPersonal" className="erreur-texte">{errorPersonal}</div>

          <div className="groupe-champ">
            <div className="groupe-conditions">
              <input
                type="checkbox"
                name="accepteConditions"
                id="checkbox-conditions"
                checked={formulaire.accepteConditions}
                onChange={gererChangement}
                required
              />
              <label htmlFor="checkbox-conditions" className="texte-conditions">
                J'ai lu et j'accepte les <a href="#" className="lien-conditions">conditions d'utilisations</a>
              </label>
            </div>
          </div>

          <div id="errorConditions" className="erreur-texte">{errorConditions}</div>
          <div id="validationText" className="succes-texte">{validationText}</div>
          
          <input 
            type="button" 
            value="S'inscrire" 
            className="bouton-inscription" 
            onClick={test}
          />
        </form>

        <div className="zone-connexion">
          Vous avez déjà un compte? 
          <a href="#" className="lien-connexion">Se connecter</a>
        </div>
      </div>
    </div>
  );
}