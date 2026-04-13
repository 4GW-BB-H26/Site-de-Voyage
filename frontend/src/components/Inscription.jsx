//Très inspiré de l'exercice 3 fourni par Mme Rim Mseddi
import React, { useState, useRef } from "react";
import "../styles/styles.css";
import { registerUser } from "../api/users.js";

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
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulaire({
      ...formulaire,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitForm = async () => {
    setSubmitted(true);
    setValidationText("");

    const form = formRef.current;
    const elements = form.elements;

    let personal = true;
    if (
      !elements.nom.checkValidity() ||
      !elements.prenom.checkValidity() ||
      !elements.username.checkValidity() ||
      !elements.courriel.checkValidity() ||
      !elements.motDePasse.checkValidity() ||
      !elements.confirmation.checkValidity()
    ) {
      setErrorPersonal("Veuillez remplir les champs de façon appropriée SVP");
      personal = false;
    } else if (formulaire.motDePasse !== formulaire.confirmation) {
      setErrorPersonal("Les mots de passe ne correspondent pas.");
      personal = false;
    } else {
      setErrorPersonal("");
    }

    let conditions = true;
    if (!formulaire.accepteConditions) {
      setErrorConditions("Veuillez accepter les conditions d'utilisation");
      conditions = false;
    } else {
      setErrorConditions("");
    }

    if (!personal || !conditions) {
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        first_name: formulaire.prenom,
        last_name: formulaire.nom,
        username: formulaire.username,
        email: formulaire.courriel,
        password: formulaire.motDePasse,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        const messageErreur =
          data.error || data.message || "Inscription impossible pour le moment.";
        const recouvrement = typeof data.recouvrement === "string" ? data.recouvrement : "";
        setErrorPersonal(recouvrement ? `${messageErreur} ${recouvrement}` : messageErreur);
        return;
      }
      if (data.user) {
        sessionStorage.setItem("travelExpressUser", JSON.stringify(data.user));
      }
      if (data.token) {
        sessionStorage.setItem("travelExpressToken", data.token);
      }
      setTimeout(() => {
      window.location.hash = "#/login"
    }, 1000);
      setValidationText(
        `Compte cree pour ${formulaire.prenom} ${formulaire.nom}. Vous pouvez maintenant vous connecter.`
      );
    } catch {
      setErrorPersonal(
        "Impossible de joindre le serveur. Verifiez que l'API est demarree (port 3000)."
      );
    } finally {
      setLoading(false);
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
                J&apos;ai lu et j&apos;accepte les{" "}
                <span className="lien-conditions">conditions d&apos;utilisations</span>
              </label>
            </div>
          </div>

          <div id="errorConditions" className="erreur-texte">{errorConditions}</div>
          <div id="validationText" className="succes-texte">{validationText}</div>
          
          <input
            type="button"
            value={loading ? "Envoi..." : "S'inscrire"}
            className="bouton-inscription"
            onClick={submitForm}
            disabled={loading}
          />
        </form>

        <div className="zone-connexion">
          <label>
          Déjà un compte?
          <a href="/#/login" className="lien-connexion">Connectez-vous!</a>
        </label>
        </div>
      </div>
    </div>
  );
}