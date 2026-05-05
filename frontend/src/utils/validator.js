/**
 * Validation et assainissement côté navigateur avec le paquet npm validator.
 */
import validator from "validator";

const OPTIONS_MDP_FORT = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
};

/** Retire les espaces en bout de chaîne avec la fonction trim du paquet validator. */
export function trimChamp(v) {
  if (v == null) return "";
  return validator.trim(String(v));
}

/**
 * Vérifie le courriel et le mot de passe avant la requête de connexion.
 * Renvoie ok, un message d'erreur si besoin, et le courriel déjà trimé pour l'envoi.
 */
export function validerConnexion(champs) {
  const email = trimChamp(champs.email);
  if (validator.isEmpty(email)) {
    return { ok: false, message: "Veuillez entrer votre courriel.", email };
  }
  if (!validator.isEmail(email)) {
    return { ok: false, message: "Courriel invalide.", email };
  }
  const password = champs.password;
  if (password == null || validator.isEmpty(String(password))) {
    return { ok: false, message: "Veuillez entrer votre mot de passe.", email };
  }
  return { ok: true, email };
}

/**
 * Vérifie tout le formulaire d'inscription avant l'appel à l'API.
 * Renvoie ok, un message d'erreur, ou le corps JSON prêt pour registerUser.
 */
export function validerFormulaireInscription(f) {
  const prenom = trimChamp(f.prenom);
  const nom = trimChamp(f.nom);
  const username = trimChamp(f.username);
  const courriel = trimChamp(f.courriel);
  const motDePasse = f.motDePasse != null ? String(f.motDePasse) : "";
  const confirmation = f.confirmation != null ? String(f.confirmation) : "";

  if (
    validator.isEmpty(prenom) ||
    validator.isEmpty(nom) ||
    validator.isEmpty(username) ||
    validator.isEmpty(courriel)
  ) {
    return { ok: false, message: "Veuillez remplir tous les champs obligatoires." };
  }
  if (!validator.isLength(prenom, { min: 1, max: 200 })) {
    return { ok: false, message: "Le prénom est trop long (200 caractères max)." };
  }
  if (!validator.isLength(nom, { min: 1, max: 200 })) {
    return { ok: false, message: "Le nom est trop long (200 caractères max)." };
  }
  if (!validator.isLength(username, { min: 2, max: 100 })) {
    return {
      ok: false,
      message: "Le nom d'utilisateur doit contenir entre 2 et 100 caractères.",
    };
  }
  if (!validator.isEmail(courriel)) {
    return { ok: false, message: "Courriel invalide." };
  }
  if (validator.isEmpty(motDePasse)) {
    return { ok: false, message: "Le mot de passe est requis." };
  }
  if (!validator.isStrongPassword(motDePasse, OPTIONS_MDP_FORT)) {
    return {
      ok: false,
      message:
        "Mot de passe trop faible : au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
    };
  }
  if (motDePasse !== confirmation) {
    return { ok: false, message: "Les mots de passe ne correspondent pas." };
  }

  return {
    ok: true,
    payload: {
      first_name: prenom,
      last_name: nom,
      username,
      email: courriel,
      password: motDePasse,
    },
  };
}

/**
 * Échappe le HTML pour afficher du texte dont on ne connaît pas la provenance.
 */
export function echapperAffichage(texte) {
  if (texte == null) return "";
  return validator.escape(String(texte));
}

/**
 * Vérifie que l'identifiant ressemble à un entier strictement positif avant un fetch.
 */
export function estIdentifiantUtilisateurValide(userId) {
  if (userId == null) return false;
  const s = String(userId).trim();
  return validator.isInt(s, { min: 1 });
}

/**
 * Vérifie le formulaire de recherche sur la page d'accueil (dates type input date, voyageurs entier).
 * En cas de succès, renvoie aussi les champs normalisés pour le filtrage des offres.
 */
export function validerRechercheVoyage(champs) {
  const destination = trimChamp(champs.destination);
  const depart = trimChamp(champs.depart);
  const retour = trimChamp(champs.retour);
  const voyageurs = trimChamp(champs.voyageurs);

  if (validator.isEmpty(destination)) {
    return { ok: false, message: "Indiquez une destination." };
  }
  if (validator.isEmpty(depart) || validator.isEmpty(retour)) {
    return { ok: false, message: "Choisissez les dates de départ et de retour." };
  }
  const dDep = trimChamp(depart);
  const dRet = trimChamp(retour);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dDep) || !/^\d{4}-\d{2}-\d{2}$/.test(dRet)) {
    return { ok: false, message: "Les dates ne sont pas valides." };
  }
  const t0 = Date.parse(`${dDep}T00:00:00`);
  const t1 = Date.parse(`${dRet}T00:00:00`);
  if (Number.isNaN(t0) || Number.isNaN(t1)) {
    return { ok: false, message: "Les dates ne sont pas valides." };
  }
  if (t1 < t0) {
    return { ok: false, message: "La date de retour doit être le même jour ou après la date de départ." };
  }
  if (validator.isEmpty(voyageurs) || !validator.isInt(String(voyageurs), { min: 1, max: 99 })) {
    return { ok: false, message: "Le nombre de voyageurs doit être un entier entre 1 et 99." };
  }
  const n = Number.parseInt(String(voyageurs), 10);
  const pays = trimChamp(champs.pays) || "all";
  return { ok: true, destination, depart: dDep, retour: dRet, voyageurs: n, pays };
}
